import { MediaStatus } from '../constants/mediaStatus.js';
import { ApiClient } from './apiClient.js';

export const MediaAPI = {
    async getMediaStatus(mediaId, mediaType) {
        try {
            await ApiClient.authenticate();
            const endpoint = `/${mediaType.toLowerCase()}/${mediaId}`;
            const response = await ApiClient.makeRequest(endpoint);
            return response?.mediaInfo?.status || MediaStatus.NOT_AVAILABLE;
        } catch (error) {
            console.error('Erreur lors de la récupération du statut:', error);
            return MediaStatus.NOT_AVAILABLE;
        }
    },

    async getTVDetails(tvId) {
        try {
            await ApiClient.authenticate();
            return await ApiClient.makeRequest(`/tv/${tvId}`);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la série:', error);
            throw error;
        }
    },

    getStatusDetails(status) {
        switch (parseInt(status, 10)) {
            case MediaStatus.AVAILABLE:
                return { label: 'Disponible', class: 'available', requestable: false };
            case MediaStatus.PENDING:
                return { label: 'Déjà demandé', class: 'pending', requestable: false };
            case MediaStatus.PROCESSING:
                return { label: 'En traitement', class: 'processing', requestable: false };
            case MediaStatus.PARTIALLY_AVAILABLE:
                return { label: 'En partie', class: 'partial', requestable: true };
            default:
                return { label: 'Non disponible', class: 'not-available', requestable: true };
        }
    },

    async searchMedia(query) {
        try {
            await ApiClient.authenticate();
            const data = await ApiClient.makeRequest(`/search?query=${encodeURIComponent(query)}`);
            
            if (!data?.results?.length) {
                return [];
            }

            return await Promise.all(data.results.map(async result => {
                const status = await this.getMediaStatus(result.id, result.mediaType);
                const statusDetails = this.getStatusDetails(status);

                return {
                    id: parseInt(result.id, 10),
                    title: result.title || result.name,
                    overview: result.overview,
                    releaseDate: result.releaseDate || result.firstAirDate,
                    posterPath: result.posterPath,
                    mediaType: result.mediaType,
                    status: status,
                    statusLabel: statusDetails.label,
                    statusClass: statusDetails.class,
                    requestable: statusDetails.requestable,
                    rating: result.voteAverage,
                    year: result.releaseDate || result.firstAirDate 
                        ? new Date(result.releaseDate || result.firstAirDate).getFullYear() 
                        : ''
                };
            }));
        } catch (error) {
            console.error('Erreur de recherche:', error);
            throw error;
        }
    },

    async requestMedia(mediaId, mediaType) {
        try {
            await ApiClient.authenticate();
            const numericMediaId = parseInt(mediaId, 10);
            if (isNaN(numericMediaId)) {
                throw new Error('L\'ID du média doit être un nombre valide');
            }

            let requestBody = {
                mediaType: mediaType.toLowerCase(),
                mediaId: numericMediaId,
                is4k: false
            };

            if (mediaType.toLowerCase() === 'tv') {
                const tvDetails = await this.getTVDetails(numericMediaId);
                if (tvDetails && tvDetails.numberOfSeasons) {
                    requestBody.seasons = Array.from(
                        { length: tvDetails.numberOfSeasons },
                        (_, i) => i + 1
                    );
                }
                if (tvDetails.externalIds) {
                    requestBody.tvdbId = tvDetails.externalIds.tvdbId;
                }
            }

            return await ApiClient.makeRequest('/request', {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });
        } catch (error) {
            console.error('Erreur de requête média:', error);
            throw error;
        }
    }
};
import { MediaAPI } from '../api/mediaApi.js';
import { MediaStatus } from '../constants/mediaStatus.js';
import { styles } from './styles.js';
import { showNotification } from './notifications.js';

// Base Modal class for search functionality
export const SearchModal = {
    init() {
        this.injectStyles();
        this.modal = this.createModal();
        document.body.appendChild(this.modal);
        this.bindEvents();
    },

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Rechercher un média</h2>
                    <button class="close-button">&times;</button>
                </div>
                <div class="search-container">
                    <div class="search-input-container">
                        <input type="text" id="searchInput" placeholder="Rechercher un film ou une série..." autocomplete="off">
                        <button class="search-button" title="Rechercher">
                            <i class="md-icon">search</i>
                        </button>
                    </div>
                    <div class="filter-container">
                        <label>
                            <input type="checkbox" id="hideAvailable">
                            Masquer les médias disponibles et demandés
                        </label>
                    </div>
                </div>
                <div class="loading-spinner"></div>
                <div class="results-container"></div>
            </div>
        `;
        return modal;
    },

    getMediaTypeLabel(mediaType) {
        return mediaType.toLowerCase() === 'tv' ? 'Série' : 'Film';
    },

    displayResults(results, hideAvailable) {
        const container = this.modal.querySelector('.results-container');
        const loadingSpinner = this.modal.querySelector('.loading-spinner');
        
        loadingSpinner.style.display = 'none';
        container.innerHTML = '';

        if (!results?.length) {
            container.innerHTML = '<p class="no-results">Aucun résultat trouvé</p>';
            return;
        }

        const filteredResults = hideAvailable ? results.filter(result => 
            result.status !== MediaStatus.AVAILABLE && 
            result.status !== MediaStatus.PENDING
        ) : results;
        
        if (filteredResults.length === 0) {
            container.innerHTML = '<p class="no-results">Tous les médias sont déjà disponibles ou demandés</p>';
            return;
        }

        filteredResults.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.setAttribute('data-id', result.id);
            resultElement.setAttribute('data-type', result.mediaType);
            
            const mediaTypeLabel = this.getMediaTypeLabel(result.mediaType);
            const year = result.year ? ` (${result.year})` : '';

            resultElement.innerHTML = `
                <div class="result-content">
                    <div class="image-container">
                        <img src="https://image.tmdb.org/t/p/w200${result.posterPath}" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzM0MyIvPjx0ZXh0IHg9IjUwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4='" 
                             alt="${result.title}"
                             loading="lazy">
                        <span class="status-badge ${result.statusClass}">${result.statusLabel}</span>
                    </div>
                    <div class="result-info">
                        <div class="media-type-badge">${mediaTypeLabel}</div>
                        <h3 class="result-title">${result.title}${year}</h3>
                        <p class="result-overview">${result.overview || 'Aucune description disponible'}</p>
                        ${result.requestable ? `
                            <button class="request-button" data-id="${result.id}" data-type="${result.mediaType}">
                                Demander
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;

            container.appendChild(resultElement);
        });
    },

    async updateMediaStatus(mediaId, mediaType, resultElement) {
        try {
            const status = await MediaAPI.getMediaStatus(mediaId, mediaType);
            const statusDetails = MediaAPI.getStatusDetails(status);
            
            const statusBadge = resultElement.querySelector('.status-badge');
            const requestButton = resultElement.querySelector('.request-button');
            
            statusBadge.className = `status-badge ${statusDetails.class}`;
            statusBadge.textContent = statusDetails.label;
            
            if (!statusDetails.requestable && requestButton) {
                requestButton.remove();
            }
            
            return status;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            return null;
        }
    },

    bindEvents() {
        const searchInput = this.modal.querySelector('#searchInput');
        const hideAvailableCheckbox = this.modal.querySelector('#hideAvailable');
        const loadingSpinner = this.modal.querySelector('.loading-spinner');
        let searchTimeout;

        const performSearch = async () => {
            const query = searchInput.value.trim();
            if (query.length > 2) {
                loadingSpinner.style.display = 'block';
                try {
                    const results = await MediaAPI.searchMedia(query);
                    this.displayResults(results, hideAvailableCheckbox.checked);
                } catch (error) {
                    showNotification(error.message, 'error');
                    loadingSpinner.style.display = 'none';
                }
            }
        };

        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 500);
        });

        hideAvailableCheckbox.addEventListener('change', performSearch);

        this.modal.querySelector('.results-container').addEventListener('click', async (e) => {
            if (e.target.classList.contains('request-button')) {
                const button = e.target;
                const mediaId = button.dataset.id;
                const mediaType = button.dataset.type;
                const resultElement = button.closest('.result-item');
                
                try {
                    button.disabled = true;
                    button.textContent = 'Envoi...';
                    
                    await MediaAPI.requestMedia(mediaId, mediaType);
                    showNotification('Demande envoyée avec succès !', 'success');
                    
                    const newStatus = await this.updateMediaStatus(mediaId, mediaType, resultElement);
                    
                    if (hideAvailableCheckbox.checked && 
                        (newStatus === MediaStatus.AVAILABLE || newStatus === MediaStatus.PENDING)) {
                        resultElement.remove();
                    }
                    
                } catch (error) {
                    showNotification(error.message, 'error');
                    button.disabled = false;
                    button.textContent = 'Demander';
                }
            }
        });

        this.modal.querySelector('.close-button').addEventListener('click', () => this.hide());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.hide();
            }
        });
    },

    show() {
        this.modal.style.display = 'block';
        this.modal.querySelector('#searchInput').focus();
    },

    hide() {
        this.modal.style.display = 'none';
        this.modal.querySelector('#searchInput').value = '';
        this.modal.querySelector('.results-container').innerHTML = '';
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    }
};

// Function to create custom modals
export function createModal({ title, content, onSubmit }) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background-color: rgb(28, 28, 28);
            width: 90%;
            max-width: 600px;
            border-radius: 30px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
            
            <div class="modal-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <h2 style="margin: 0; color: #fff; font-size: 1.8em; font-weight: normal;">${title}</h2>
                <button class="close-button" style="
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 8px;
                    opacity: 0.7;">&times;</button>
            </div>

            <div class="modal-body">
                ${content}
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 1em; margin-top: 20px;">
                <button class="cancel-button" style="
                    background: rgba(0, 0, 0, 0.2);
                    border: none;
                    border-radius: 30px;
                    padding: 0.6em 1.2em;
                    color: #fff;
                    cursor: pointer;">
                    Annuler
                </button>
                <button class="submit-button" style="
                    background: var(--theme-primary-color);
                    border: none;
                    border-radius: 30px;
                    padding: 0.6em 1.2em;
                    color: #fff;
                    cursor: pointer;">
                    Envoyer
                </button>
            </div>
        </div>
    `;

    const closeModal = () => {
        modal.remove();
    };

    modal.querySelector('.close-button').addEventListener('click', closeModal);
    modal.querySelector('.cancel-button').addEventListener('click', closeModal);
    modal.querySelector('.submit-button').addEventListener('click', () => onSubmit(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Add styles for form elements
    const style = document.createElement('style');
    style.textContent = `
        .custom-modal select,
        .custom-modal textarea {
            width: calc(100% - 2em);
            padding: 0.6em 1em;
            background: rgba(0, 0, 0, 0.2);
            border: none;
            border-radius: 30px;
            color: #fff;
            margin-top: 0.5em;
        }
        
        .custom-modal textarea {
            resize: vertical;
            min-height: 100px;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);
    return modal;
}
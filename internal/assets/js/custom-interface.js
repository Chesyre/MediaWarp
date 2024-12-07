(function() {
    // Configuration
    const CONFIG = {
        JELLYSEERR_API_URL: 'http://localhost:3000/api/v1',
        API_KEY: 'MTczMzUzOTI0MTY3NmRmZTBmNTY5LTg0NDgtNGZiZS04Yzc3LTJiMzQzYTg0YWVhYQ=='
    };

    // Media Status Constants
    const MediaStatus = {
        AVAILABLE: 5,
        PENDING: 3,
        PROCESSING: 2,
        PARTIALLY_AVAILABLE: 4,
        NOT_AVAILABLE: 0
    };

    // API Helper
    const MediaAPI = {
        async makeRequest(endpoint, options = {}) {
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'X-Api-Key': CONFIG.API_KEY,
                    'Accept': 'application/json'
                }
            };

            try {
                const response = await fetch(`${CONFIG.JELLYSEERR_API_URL}${endpoint}`, {
                    ...defaultOptions,
                    ...options,
                    headers: { ...defaultOptions.headers, ...options.headers }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error(`Erreur API: ${endpoint}`, error);
                throw error;
            }
        },

        async getMediaStatus(mediaId, mediaType) {
            try {
                const endpoint = `/${mediaType.toLowerCase()}/${mediaId}`;
                const response = await this.makeRequest(endpoint);
                return response?.mediaInfo?.status || MediaStatus.NOT_AVAILABLE;
            } catch (error) {
                console.error('Erreur lors de la récupération du statut:', error);
                return MediaStatus.NOT_AVAILABLE;
            }
        },

        async getTVDetails(tvId) {
            try {
                return await this.makeRequest(`/tv/${tvId}`);
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
                    return { label: 'En cours de traitement', class: 'processing', requestable: false };
                case MediaStatus.PARTIALLY_AVAILABLE:
                    return { label: 'Partiellement disponible', class: 'partial', requestable: true };
                default:
                    return { label: 'Non disponible', class: 'not-available', requestable: true };
            }
        },

        async searchMedia(query) {
            try {
                const data = await this.makeRequest(`/search?query=${encodeURIComponent(query)}`);
                
                if (!data?.results?.length) {
                    return [];
                }

                const results = await Promise.all(data.results.map(async result => {
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

                return results;
            } catch (error) {
                console.error('Erreur de recherche:', error);
                throw error;
            }
        },

        async requestMedia(mediaId, mediaType) {
            try {
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

                return await this.makeRequest('/request', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });
            } catch (error) {
                console.error('Erreur de requête média:', error);
                throw error;
            }
        }
    };

    // UI Helper
    const UI = {
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
                                Masquer les médias disponibles
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

            const filteredResults = hideAvailable ? results.filter(result => result.status !== MediaStatus.AVAILABLE) : results;
            
            if (filteredResults.length === 0) {
                container.innerHTML = '<p class="no-results">Tous les médias sont déjà disponibles</p>';
                return;
            }

            filteredResults.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.className = 'result-item';
                
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
                        this.showNotification(error.message, 'error');
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
                    
                    try {
                        button.disabled = true;
                        button.textContent = 'Envoi...';
                        
                        await MediaAPI.requestMedia(mediaId, mediaType);
                        
                        this.showNotification('Demande envoyée avec succès !', 'success');
                        button.textContent = 'Demandé';
                        button.style.backgroundColor = '#f39c12';
                    } catch (error) {
                        this.showNotification(error.message, 'error');
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

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
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
            style.textContent = `
                .custom-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 1000;
                    backdrop-filter: blur(8px);
                }

                .modal-content {
                    position: relative;
                    background-color: rgb(28, 28, 28);
                    margin: 2% auto;
                    padding: 25px;
                    width: 90%;
                    max-width: 1200px;
                    border-radius: 30px;
                    max-height: 90vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .modal-header h2 {
                    margin: 0;
                    color: #fff;
                    font-size: 1.8em;
                    font-weight: normal;
                }

                .close-button {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 8px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }

                .close-button:hover {
                    opacity: 1;
                }

                .search-container {
                    margin-bottom: 20px;
                }

                .search-input-container {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                #searchInput {
                    flex: 1;
                    padding: 0.6em 1em;
                    border: none;
                    border-radius: 30px;
                    background: rgba(0, 0, 0, 0.2);
                    color: #fff;
                    font-size: 1.1em;
                }

                #searchInput:focus {
                    outline: none;
                    background: rgba(0, 0, 0, 0.3);
                }

                .search-button {
                    background: rgba(0, 0, 0, 0.2);
                    border: none;
                    border-radius: 30px;
                    padding: 0.6em 1.2em;
                    cursor: pointer;
                    color: white;
                    transition: background 0.2s;
                }

                .search-button:hover {
                    background: rgba(0, 0, 0, 0.3);
                }

                .filter-container {
                    color: rgba(255, 255, 255, 0.7);
                    margin-top: 1em;
                }

                .filter-container label {
                    display: flex;
                    align-items: center;
                    gap: 0.5em;
                    cursor: pointer;
                }

                .result-item {
                    background: rgba(0, 0, 0, 0.2);
                    margin-bottom: 1em;
                    border-radius: 30px;
                    overflow: hidden;
                    transition: transform 0.2s;
                }

                .result-item:hover {
                    transform: translateY(-2px);
                }

                .result-content {
                    display: flex;
                    gap: 25px;
                    padding: 1.5em;
                }

                .image-container {
                    position: relative;
                    flex-shrink: 0;
                    width: 150px;
                    height: 225px;
                    border-radius: 15px;
                    overflow: hidden;
                }

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .status-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 4px 12px;
                    border-radius: 30px;
                    font-size: 0.8em;
                    background: rgba(0, 0, 0, 0.7);
                    color: #fff;
                    backdrop-filter: blur(4px);
                }

                .status-badge.available {
                    background: rgba(40, 167, 69, 0.8);
                }

                .status-badge.pending {
                    background: rgba(255, 193, 7, 0.8);
                }

                .status-badge.processing {
                    background: rgba(23, 162, 184, 0.8);
                }

                .status-badge.partial {
                    background: rgba(108, 117, 125, 0.8);
                }

                .status-badge.not-available {
                    background: rgba(220, 53, 69, 0.8);
                }

                .result-info {
                    flex: 1;
                }

                .media-type-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 30px;
                    background: rgba(115, 115, 115, 0.5);
                    backdrop-filter: blur(1.5em) saturate(1.8);
                    color: #fff;
                    font-size: 0.9em;
                    margin-bottom: 0.5em;
                }

                .result-title {
                    margin: 0.5em 0;
                    font-size: 1.4em;
                    color: #fff;
                    font-weight: normal;
                }

                .result-overview {
                    color: rgba(255, 255, 255, 0.7);
                    margin: 1em 0;
                    line-height: 1.5;
                }

                .request-button {
                    background: rgba(115, 115, 115, 0.5);
                    backdrop-filter: blur(1.5em) saturate(1.8);
                    border: none;
                    border-radius: 30px;
                    padding: 0.6em 1.2em;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 1em;
                }

                .request-button:hover:not(:disabled) {
                    background: var(--theme-primary-color);
                    transform: translateY(-1px);
                }

                .request-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 24px;
                    border-radius: 30px;
                    color: white;
                    z-index: 1100;
                    animation: slideIn 0.3s ease-out;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(8px);
                }

                .notification.success {
                    background: rgba(40, 167, 69, 0.9);
                }

                .notification.error {
                    background: rgba(220, 53, 69, 0.9);
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .loading-spinner {
                    display: none;
                    width: 40px;
                    height: 40px;
                    margin: 20px auto;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .no-results {
                    text-align: center;
                    color: rgba(255, 255, 255, 0.5);
                    padding: 40px;
                }
            `;
            document.head.appendChild(style);
        }
    };

    function addRequestButton() {
        const existingButton = document.querySelector('[data-custom="request-button"]');
        if (existingButton) {
            existingButton.remove();
        }

        const menuItems = document.querySelector('.navDrawerItemsContainer');
        if (!menuItems) {
            setTimeout(addRequestButton, 1000);
            return;
        }

        const button = document.createElement('button');
        button.className = 'listItem listItem-autoactive itemAction listItem-button listItemCursor listItem-hoverable navMenuOption navDrawerListItem';
        button.setAttribute('data-action', 'custom');
        button.setAttribute('data-custom', 'request-button');
        button.setAttribute('type', 'button');
        
        button.innerHTML = `
            <div title="Faire une requête" class="navMenuOption-listItem-content listItem-content listItem-content-bg listItemContent-touchzoom">
                <div data-action="custom" class="navDrawerListItemImageContainer listItemImageContainer listItemImageContainer-margin listItemImageContainer-square" style="aspect-ratio:1">
                    <i class="navDrawerListItemIcon listItemIcon md-icon autortl">add_to_queue</i>
                </div>
                <div class="navDrawerListItemBody listItemBody listItemBody-1-lines">
                    <div class="listItemBodyText listItemBodyText-nowrap listItemBodyText-lf">Faire une requête</div>
                </div>
            </div>
        `;

        button.addEventListener('click', () => UI.show());

        const searchButton = menuItems.querySelector('[data-action="search"]');
        if (searchButton) {
            searchButton.parentNode.insertBefore(button, searchButton.nextSibling);
        } else {
            menuItems.appendChild(button);
        }
    }

    // Initialisation
    function init() {
        UI.init();
        addRequestButton();

        const observer = new MutationObserver(() => {
            if (!document.querySelector('[data-custom="request-button"]')) {
                addRequestButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('hashchange', addRequestButton);
        window.addEventListener('popstate', addRequestButton);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
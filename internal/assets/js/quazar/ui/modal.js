import { MediaAPI } from '../api/mediaApi.js';
import { MediaStatus } from '../constants/mediaStatus.js';
import { styles } from './styles.js';

export const Modal = {
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
        style.textContent = styles;
        document.head.appendChild(style);
    }
};
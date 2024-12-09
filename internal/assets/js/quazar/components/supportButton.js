import { ApiClient } from '../api/apiClient.js';
import { createModal } from '../ui/modal.js';
import { showNotification } from '../ui/notifications.js';

export const SupportButton = {
    create() {
        const button = document.createElement('button');
        button.className = 'listItem listItem-autoactive itemAction listItem-button listItemCursor listItem-hoverable navMenuOption navDrawerListItem';
        button.setAttribute('data-action', 'custom');
        button.setAttribute('data-custom', 'support-button');
        button.setAttribute('type', 'button');
        
        button.innerHTML = `
            <div title="Support" class="navMenuOption-listItem-content listItem-content listItem-content-bg listItemContent-touchzoom">
                <div data-action="custom" class="navDrawerListItemImageContainer listItemImageContainer listItemImageContainer-margin listItemImageContainer-square" style="aspect-ratio:1">
                    <i class="navDrawerListItemIcon listItemIcon md-icon autortl">support</i>
                </div>
                <div class="navDrawerListItemBody listItemBody listItemBody-1-lines">
                    <div class="listItemBodyText listItemBodyText-nowrap listItemBodyText-lf">Support</div>
                </div>
            </div>
        `;

        button.addEventListener('click', () => this.showSupportModal());
        return button;
    },

    async showSupportModal() {
        try {
            await ApiClient.authenticate();
            const [issues, counts] = await Promise.all([
                ApiClient.makeRequest('/issue?take=50'),
                ApiClient.makeRequest('/issue/count')
            ]);

            createModal({
                title: 'Support',
                content: `
                    <div class="support-modal">
                        <div class="how-it-works-section">
                            <h3><i class="md-icon">analytics</i> Vue d'ensemble</h3>
                            <div class="stats-container">
                                <div class="stat-item">
                                    <i class="md-icon">pending</i>
                                    <div class="stat-details">
                                        <div class="stat-label">En cours</div>
                                        <div class="stat-value">${counts.open}</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <i class="md-icon">check_circle</i>
                                    <div class="stat-details">
                                        <div class="stat-label">Résolus</div>
                                        <div class="stat-value">${counts.closed}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="how-it-works-section">
                            <h3><i class="md-icon">filter_list</i> Filtres</h3>
                            <div class="filter-container">
                                <select id="issueStatusFilter" class="emby-select-withcolor">
                                    <option value="all">Tous les statuts</option>
                                    <option value="open" selected>En cours</option>
                                    <option value="resolved">Résolus</option>
                                </select>
                                <select id="issueTypeFilter" class="emby-select-withcolor">
                                    <option value="all">Tous les types</option>
                                    <option value="1">Vidéo</option>
                                    <option value="2">Audio</option>
                                    <option value="3">Sous-titres</option>
                                    <option value="4">Autre</option>
                                </select>
                            </div>
                        </div>

                        <div class="how-it-works-section">
                            <h3><i class="md-icon">list</i> Problèmes signalés</h3>
                            <div class="issues-container">
                                ${this.renderIssuesList(issues.results)}
                            </div>
                        </div>
                    </div>
                `,
                customStyles: `
                    .support-modal {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .how-it-works-section {
                        margin-bottom: 2em;
                        padding: 1.5em;
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 15px;
                    }

                    .how-it-works-section:last-child {
                        margin-bottom: 0;
                    }

                    .how-it-works-section h3 {
                        display: flex;
                        align-items: center;
                        gap: 0.5em;
                        margin: 0 0 1em 0;
                        color: var(--theme-primary-color);
                        font-size: 1.3em;
                    }

                    .stats-container {
                        display: flex;
                        gap: 1em;
                        flex-wrap: wrap;
                    }

                    .stat-item {
                        flex: 1;
                        min-width: 200px;
                        display: flex;
                        align-items: center;
                        gap: 1em;
                        padding: 1em;
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                    }

                    .stat-item i {
                        font-size: 2em;
                        color: var(--theme-primary-color);
                    }

                    .stat-details {
                        flex: 1;
                    }

                    .stat-label {
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 0.9em;
                    }

                    .stat-value {
                        font-size: 1.8em;
                        font-weight: 500;
                        color: white;
                    }

                    .filter-container {
                        display: flex;
                        gap: 1em;
                        margin-bottom: 1em;
                    }

                    .filter-container select {
                        flex: 1;
                        background: rgba(0, 0, 0, 0.2);
                        border: none;
                        border-radius: 10px;
                        padding: 0.8em 1em;
                        color: white;
                        min-width: 200px;
                    }

                    .issues-container {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 1em;
                    }

                    .issue-card {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 10px;
                        overflow: hidden;
                        transition: transform 0.2s;
                    }

                    .issue-card:hover {
                        transform: translateY(-2px);
                    }

                    .issue-media {
                        position: relative;
                        padding-top: 150%;
                    }

                    .issue-media img {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .issue-overlay {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        padding: 4em 1em 1em;
                        background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
                    }

                    .issue-title {
                        color: white;
                        font-size: 1.1em;
                        margin: 0;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .issue-meta {
                        margin-top: 0.5em;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .issue-type-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.3em;
                        padding: 0.3em 0.8em;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 15px;
                        font-size: 0.9em;
                    }

                    .issue-status-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.3em;
                        padding: 0.3em 0.8em;
                        border-radius: 15px;
                        font-size: 0.9em;
                    }

                    .issue-status-badge.open {
                        background: rgba(76, 175, 80, 0.2);
                        color: #4CAF50;
                    }

                    .issue-status-badge.resolved {
                        background: rgba(158, 158, 158, 0.2);
                        color: #9E9E9E;
                    }

                    .issue-content {
                        padding: 1em;
                    }

                    .issue-message {
                        color: rgba(255, 255, 255, 0.7);
                        margin: 0;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        line-height: 1.5;
                    }

                    .issue-footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1em;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .issue-date {
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 0.9em;
                    }

                    .issue-actions {
                        display: flex;
                        gap: 0.5em;
                    }

                    .action-button {
                        background: rgba(var(--theme-primary-color-rgb), 0.1);
                        border: none;
                        border-radius: 20px;
                        padding: 0.4em 1em;
                        color: var(--theme-primary-color);
                        cursor: pointer;
                        transition: all 0.2s;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5em;
                    }

                    .action-button:hover {
                        background: var(--theme-primary-color);
                        color: white;
                    }

                    .no-issues {
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: 3em;
                        color: rgba(255, 255, 255, 0.5);
                    }

                    .no-issues i {
                        font-size: 48px;
                        margin-bottom: 0.5em;
                        opacity: 0.5;
                    }
                `
            });

            // Add event listeners for filters
            const statusFilter = document.getElementById('issueStatusFilter');
            const typeFilter = document.getElementById('issueTypeFilter');
            
            const updateFilters = async () => {
                const status = statusFilter.value;
                const type = typeFilter.value;
                
                const queryParams = new URLSearchParams();
                queryParams.append('take', '50');
                if (status !== 'all') queryParams.append('filter', status);
                if (type !== 'all') queryParams.append('type', type);
                
                const filteredIssues = await ApiClient.makeRequest(`/issue?${queryParams.toString()}`);
                document.querySelector('.issues-container').innerHTML = this.renderIssuesList(filteredIssues.results);
            };

            statusFilter.addEventListener('change', updateFilters);
            typeFilter.addEventListener('change', updateFilters);

            // Add click handler for action buttons
            document.querySelector('.issues-container').addEventListener('click', async (e) => {
                const actionButton = e.target.closest('.action-button');
                if (!actionButton) return;

                const issueId = actionButton.closest('.issue-card').dataset.issueId;
                if (!issueId) return;

                if (actionButton.dataset.action === 'view') {
                    this.showIssueDetails(issueId);
                }
            });

        } catch (error) {
            console.error('Error loading support modal:', error);
            showNotification('Erreur lors du chargement des problèmes', 'error');
        }
    },

    getIssueTypeLabel(type) {
        const types = {
            1: { label: 'Vidéo', icon: 'movie' },
            2: { label: 'Audio', icon: 'volume_up' },
            3: { label: 'Sous-titres', icon: 'subtitles' },
            4: { label: 'Autre', icon: 'help_outline' }
        };
        return types[type] || { label: 'Inconnu', icon: 'help_outline' };
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    renderIssuesList(issues) {
        if (!issues.length) {
            return `
                <div class="no-issues">
                    <i class="md-icon">search_off</i>
                    <div>Aucun problème trouvé</div>
                </div>
            `;
        }

        return issues.map(issue => {
            const type = this.getIssueTypeLabel(issue.issueType);
            const posterPath = issue.media?.posterPath 
                ? `https://image.tmdb.org/t/p/w300${issue.media.posterPath}`
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzM0MyIvPjx0ZXh0IHg9IjE1MCIgeT0iMjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF1Y3VuZSBhZmZpY2hlPC90ZXh0Pjwvc3ZnPg==';

            return `
                <div class="issue-card" data-issue-id="${issue.id}">
                    <div class="issue-media">
                        <img src="${posterPath}" alt="">
                        <div class="issue-overlay">
                            <h3 class="issue-title">${issue.media?.title || 'Sans titre'}</h3>
                            <div class="issue-meta">
                                <div class="issue-type-badge">
                                    <i class="md-icon">${type.icon}</i>
                                    ${type.label}
                                </div>
                                <span class="issue-status-badge ${issue.status === 'open' ? 'open' : 'resolved'}">
                                    <i class="md-icon">${issue.status === 'open' ? 'pending' : 'check_circle'}</i>
                                    ${issue.status === 'open' ? 'En cours' : 'Résolu'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="issue-content">
                        <p class="issue-message">${issue.message}</p>
                    </div>
                    <div class="issue-footer">
                        <span class="issue-date">${this.formatDate(issue.createdAt)}</span>
                        <div class="issue-actions">
                            <button class="action-button" data-action="view">
                                <i class="md-icon">visibility</i>
                                Voir
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};
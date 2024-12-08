import { CONFIG } from '../config/config.js';
import { ApiClient } from '../api/apiClient.js';
import { createModal } from '../ui/modal.js';
import { showNotification } from '../ui/notifications.js';

export const ReportButton = {
    async getCurrentItemInfo() {
        try {
            const userId = window.ApiClient._serverInfo.UserId;
            const itemId = /\?id=([A-Za-z0-9]+)/.exec(window.location.hash)?.[1];
            if (!itemId) return null;

            const item = await window.ApiClient.getItem(userId, itemId);
            const tmdbId = item.ProviderIds?.Tmdb || item.ProviderIds?.tmdb;
            
            if (!tmdbId) return null;

            const endpoint = item.Type === 'Series' ? `/tv/${tmdbId}` : `/movie/${tmdbId}`;
            const jellyseerrResponse = await ApiClient.makeRequest(endpoint);
            
            return {
                title: item.Name,
                mediaId: jellyseerrResponse?.mediaInfo?.id
            };
        } catch (error) {
            console.error('Error getting item info:', error);
            return null;
        }
    },

    async handleReportClick() {
        const itemInfo = await this.getCurrentItemInfo();
        if (!itemInfo) {
            showNotification('Erreur lors de la récupération des informations du média', 'error');
            return;
        }

        createModal({
            title: 'Signaler un problème',
            content: `
                <div style="margin-bottom: 1.5em;">
                    <h3 style="color: white; font-size: 1.2em; margin: 0; font-weight: 500;">${itemInfo.title}</h3>
                </div>
                <div style="margin-bottom: 1.5em;">
                    <label for="reportType" style="display: block; margin-bottom: 0.5em; color: rgba(255, 255, 255, 0.7);">
                        Type de problème:
                    </label>
                    <select id="reportType" class="emby-select-withcolor" style="background-color: rgb(28, 28, 28); color: white;">
                        <option value="1">Vidéo</option>
                        <option value="2">Audio</option>
                        <option value="3">Sous-titre</option>
                        <option value="4">Autre</option>
                    </select>
                </div>
                <div style="margin-bottom: 1.5em;">
                    <label for="reportDescription" style="display: block; margin-bottom: 0.5em; color: rgba(255, 255, 255, 0.7);">
                        Description:
                    </label>
                    <textarea id="reportDescription" rows="4" placeholder="Décrivez le problème rencontré..." style="padding-right: 1em;"></textarea>
                </div>
            `,
            onSubmit: async (modal) => {
                const type = parseInt(modal.querySelector('#reportType').value, 10);
                const description = modal.querySelector('#reportDescription').value;

                if (!description.trim()) {
                    showNotification('Veuillez fournir une description du problème', 'error');
                    return;
                }

                try {
                    await ApiClient.makeRequest('/issue', {
                        method: 'POST',
                        body: JSON.stringify({
                            issueType: type,
                            message: description,
                            mediaId: itemInfo.mediaId
                        })
                    });

                    showNotification('Problème signalé avec succès', 'success');
                    modal.remove();
                } catch (error) {
                    console.error('Error submitting issue:', error);
                    showNotification('Erreur lors de l\'envoi du signalement', 'error');
                }
            }
        });
    },

    create() {
        const reportButton = document.createElement('button');
        reportButton.setAttribute('is', 'emby-button');
        reportButton.setAttribute('type', 'button');
        reportButton.className = 'detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary report-problem-button';
        reportButton.style.cssText = 'margin-top: 1em !important; display: inline-flex !important; visibility: visible !important; opacity: 1 !important; width: auto !important;';
        
        reportButton.innerHTML = `
            <div class="detailButton-content" style="display: flex !important; align-items: center !important;">
                <i class="md-icon detailButton-icon button-icon button-icon-left" style="color: #ff5252;">error_outline</i>
                <span class="button-text">Signaler un problème</span>
            </div>
        `;

        reportButton.addEventListener('click', () => this.handleReportClick());
        return reportButton;
    },

    addReportButton() {
        const reportBtnsId = "ReportButtonContainer";
        let reportBtns = document.getElementById(reportBtnsId);
        if (reportBtns) {
            reportBtns.remove();
        }

        const mainDetailButtons = document.querySelector("div[is='emby-scroller']:not(.hide) .mainDetailButtons");
        if (!mainDetailButtons) {
            setTimeout(() => this.addReportButton(), 1000);
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.id = reportBtnsId;
        buttonContainer.className = "detailButtons flex align-items-flex-start flex-wrap-wrap";
        buttonContainer.appendChild(this.create());

        mainDetailButtons.insertAdjacentElement("afterend", buttonContainer);
    },

    init() {
        function showFlag() {
            const mediaInfoPrimary = document.querySelector("div[is='emby-scroller']:not(.hide) .mediaInfoPrimary:not(.hide)");
            const btnManualRecording = document.querySelector("div[is='emby-scroller']:not(.hide) .btnManualRecording:not(.hide)");
            return !!mediaInfoPrimary || !!btnManualRecording;
        }

        document.addEventListener("viewbeforeshow", (e) => {
            if (e.detail.contextPath?.startsWith("/item?id=") || e.detail.params?.id) {
                const mutation = new MutationObserver(() => {
                    if (showFlag()) {
                        this.addReportButton();
                        mutation.disconnect();
                    }
                });

                mutation.observe(document.body, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                });
            }
        });

        if (window.location.hash.includes('/item?id=')) {
            this.addReportButton();
        }
    }
};
export const ReportButton = {
    init() {
        this.injectButton();
        this.bindEvents();
    },

    injectButton() {
        // Find the directors container
        const directorsContainer = document.querySelector('.directors');
        if (!directorsContainer) return;

        // Create and insert the report button after the directors container
        const reportButton = document.createElement('div');
        reportButton.className = 'verticalFieldItem report-button-container focuscontainer-x';
        reportButton.innerHTML = `
            <button is="emby-button" 
                    type="button" 
                    class="button-link report-problem-button emby-button"
                    style="color: #ff5252;">
                <i class="md-icon" style="margin-right: 0.5em;">error_outline</i>
                Signaler un problème
            </button>
        `;

        directorsContainer.insertAdjacentElement('afterend', reportButton);
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.report-problem-button')) {
                this.handleReportClick();
            }
        });
    },

    handleReportClick() {
        // Get current media info
        const titleElement = document.querySelector('.itemName-primary');
        const title = titleElement ? titleElement.textContent : 'Unknown Title';

        // Create modal content
        const modalContent = `
            <div class="report-modal-content" style="padding: 2em;">
                <h2 style="margin-bottom: 1em;">Signaler un problème</h2>
                <div style="margin-bottom: 1.5em;">
                    <div style="margin-bottom: 0.5em;">Média: ${title}</div>
                </div>
                <div style="margin-bottom: 1.5em;">
                    <label for="reportType" style="display: block; margin-bottom: 0.5em;">Type de problème:</label>
                    <select id="reportType" class="emby-select-withcolor" style="width: 100%; padding: 0.5em; background: rgba(0,0,0,0.2); border: none; border-radius: 4px; color: inherit;">
                        <option value="audio">Problème audio</option>
                        <option value="subtitle">Problème de sous-titres</option>
                        <option value="video">Problème vidéo</option>
                        <option value="sync">Problème de synchronisation</option>
                        <option value="other">Autre</option>
                    </select>
                </div>
                <div style="margin-bottom: 1.5em;">
                    <label for="reportDescription" style="display: block; margin-bottom: 0.5em;">Description:</label>
                    <textarea id="reportDescription" 
                             rows="4" 
                             style="width: 100%; padding: 0.5em; background: rgba(0,0,0,0.2); border: none; border-radius: 4px; color: inherit;"
                             placeholder="Décrivez le problème rencontré..."></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 1em;">
                    <button class="cancel-report emby-button" 
                            style="padding: 0.5em 1em; border: none; border-radius: 4px; background: rgba(0,0,0,0.3); color: inherit;">
                        Annuler
                    </button>
                    <button class="submit-report emby-button-accent emby-button" 
                            style="padding: 0.5em 1em; border: none; border-radius: 4px;">
                        Envoyer
                    </button>
                </div>
            </div>
        `;

        // Create and show modal
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'report-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        modalOverlay.innerHTML = modalContent;
        document.body.appendChild(modalOverlay);

        // Handle modal events
        modalOverlay.querySelector('.cancel-report').addEventListener('click', () => {
            modalOverlay.remove();
        });

        modalOverlay.querySelector('.submit-report').addEventListener('click', () => {
            const type = modalOverlay.querySelector('#reportType').value;
            const description = modalOverlay.querySelector('#reportDescription').value;

            if (!description.trim()) {
                // Show error if description is empty
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    color: #ff5252;
                    margin-bottom: 1em;
                    font-size: 0.9em;
                `;
                errorMsg.textContent = 'Veuillez fournir une description du problème.';
                modalOverlay.querySelector('.submit-report').parentNode.insertBefore(
                    errorMsg,
                    modalOverlay.querySelector('.submit-report').parentNode.firstChild
                );
                return;
            }

            // TODO: Send report to backend
            console.log('Report submitted:', { type, description, title });

            // Show success message and close modal
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1em 2em;
                background: rgba(76, 175, 80, 0.9);
                color: white;
                border-radius: 4px;
                z-index: 1001;
                animation: slideIn 0.3s ease-out;
            `;
            successMsg.textContent = 'Problème signalé avec succès';
            document.body.appendChild(successMsg);

            setTimeout(() => {
                successMsg.remove();
            }, 3000);

            modalOverlay.remove();
        });

        // Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }
};
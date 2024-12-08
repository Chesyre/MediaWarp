import { JFAGoAuth } from '../api/jfaGoAuth.js';
import { createModal } from '../ui/modal.js';

export const SubscriptionInfo = {
    create() {
        const button = document.createElement('button');
        button.className = 'listItem listItem-autoactive itemAction listItem-button listItemCursor listItem-hoverable navMenuOption navDrawerListItem';
        button.setAttribute('data-action', 'custom');
        button.setAttribute('data-custom', 'subscription-info');
        button.setAttribute('type', 'button');
        
        this.updateSubscriptionInfo(button);
        button.addEventListener('click', () => this.showSubscriptionModal());
        
        return button;
    },

    async updateSubscriptionInfo(button) {
        try {
            const userDetails = await JFAGoAuth.getUserDetails();
            if (!userDetails || !userDetails.expiry) {
                button.innerHTML = this.renderButton('Non disponible');
                return;
            }

            const expiryDate = new Date(userDetails.expiry * 1000);
            const now = new Date();
            const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
            
            let status;
            let icon;
            let statusClass;
            
            if (daysRemaining > 30) {
                status = 'Actif';
                icon = 'check_circle';
                statusClass = 'status-active';
            } else if (daysRemaining > 0) {
                status = `Expire dans ${daysRemaining} jours`;
                icon = 'warning';
                statusClass = 'status-warning';
            } else {
                status = 'Expiré';
                icon = 'error';
                statusClass = 'status-expired';
            }

            button.innerHTML = this.renderButton(status, icon, expiryDate.toLocaleDateString('fr-FR'), statusClass);
            
        } catch (error) {
            console.error('Error updating subscription info:', error);
            button.innerHTML = this.renderButton('Erreur');
        }
    },

    renderButton(status, icon = 'account_circle', date = '', statusClass = '') {
        return `
            <div title="Abonnement" class="navMenuOption-listItem-content listItem-content listItem-content-bg listItemContent-touchzoom">
                <div data-action="custom" class="navDrawerListItemImageContainer listItemImageContainer listItemImageContainer-margin listItemImageContainer-square" style="aspect-ratio:1">
                    <i class="navDrawerListItemIcon listItemIcon md-icon autortl">${icon}</i>
                </div>
                <div class="navDrawerListItemBody listItemBody listItemBody-2-lines">
                    <div class="listItemBodyText listItemBodyText-nowrap listItemBodyText-lf">
                        <div>Abonnement</div>
                        <div class="subscription-status ${statusClass}">${status}</div>
                        ${date ? `<div class="subscription-expiry">Expire le ${date}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    async showSubscriptionModal() {
        try {
            const userDetails = await JFAGoAuth.getUserDetails();
            if (!userDetails) {
                throw new Error('Unable to get subscription details');
            }

            const expiryDate = new Date(userDetails.expiry * 1000);
            const now = new Date();
            const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

            let statusClass;
            let statusText;
            let statusIcon;

            if (daysRemaining > 30) {
                statusClass = 'status-active';
                statusText = 'Actif';
                statusIcon = 'check_circle';
            } else if (daysRemaining > 0) {
                statusClass = 'status-warning';
                statusText = `Expire dans ${daysRemaining} jours`;
                statusIcon = 'warning';
            } else {
                statusClass = 'status-expired';
                statusText = 'Expiré';
                statusIcon = 'error';
            }

            createModal({
                title: 'Information Abonnement',
                content: `
                    <div class="subscription-modal">
                        <div class="subscription-status-card ${statusClass}">
                            <i class="md-icon status-icon">${statusIcon}</i>
                            <div class="status-info">
                                <div class="status-label">Statut de l'abonnement</div>
                                <div class="status-value">${statusText}</div>
                                <div class="expiry-date">Expire le ${expiryDate.toLocaleDateString('fr-FR')}</div>
                            </div>
                        </div>

                        <div class="subscription-info-section">
                            <h3><i class="md-icon">info</i> Comment renouveler votre abonnement ?</h3>
                            <div class="renewal-steps">
                                <div class="step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <h4>Envoyez un email</h4>
                                        <p>Contactez-nous à <a href="mailto:contact@quazar.cx">contact@quazar.cx</a> en précisant votre demande de renouvellement ou de prolongation.</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <h4>Recevez le lien de paiement</h4>
                                        <p>Nous vous enverrons un lien de paiement où vous pourrez sélectionner la durée d'abonnement souhaitée.</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <h4>Effectuez le paiement</h4>
                                        <p>Choisissez votre durée d'abonnement et procédez au paiement de manière sécurisée.</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <h4>Mise à jour de votre compte</h4>
                                        <p>Notre équipe mettra à jour votre abonnement dans les plus brefs délais après confirmation du paiement.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                customStyles: `
                    .subscription-modal {
                        max-width: 800px;
                        margin: 0 auto;
                    }

                    .subscription-status-card {
                        display: flex;
                        align-items: center;
                        gap: 1.5em;
                        padding: 2em;
                        border-radius: 15px;
                        margin-bottom: 2em;
                        background: rgba(0, 0, 0, 0.2);
                    }

                    .subscription-status-card.status-active {
                        background: rgba(76, 175, 80, 0.1);
                    }

                    .subscription-status-card.status-warning {
                        background: rgba(255, 152, 0, 0.1);
                    }

                    .subscription-status-card.status-expired {
                        background: rgba(244, 67, 54, 0.1);
                    }

                    .status-icon {
                        font-size: 3em;
                    }

                    .status-active .status-icon {
                        color: #4CAF50;
                    }

                    .status-warning .status-icon {
                        color: #FF9800;
                    }

                    .status-expired .status-icon {
                        color: #F44336;
                    }

                    .status-info {
                        flex: 1;
                    }

                    .status-label {
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 0.9em;
                        margin-bottom: 0.5em;
                    }

                    .status-value {
                        font-size: 1.5em;
                        font-weight: 500;
                        margin-bottom: 0.2em;
                    }

                    .expiry-date {
                        color: rgba(255, 255, 255, 0.7);
                    }

                    .subscription-info-section {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 15px;
                        padding: 2em;
                    }

                    .subscription-info-section h3 {
                        display: flex;
                        align-items: center;
                        gap: 0.5em;
                        margin: 0 0 1.5em 0;
                        color: var(--theme-primary-color);
                    }

                    .renewal-steps {
                        display: grid;
                        gap: 1.5em;
                    }

                    .step {
                        display: flex;
                        gap: 1.5em;
                        align-items: flex-start;
                    }

                    .step-number {
                        width: 2em;
                        height: 2em;
                        background: var(--theme-primary-color);
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        flex-shrink: 0;
                    }

                    .step-content {
                        flex: 1;
                    }

                    .step-content h4 {
                        margin: 0 0 0.5em 0;
                        color: white;
                    }

                    .step-content p {
                        margin: 0;
                        color: rgba(255, 255, 255, 0.7);
                        line-height: 1.5;
                    }

                    .step-content a {
                        color: var(--theme-primary-color);
                        text-decoration: none;
                    }

                    .step-content a:hover {
                        text-decoration: underline;
                    }

                    .subscription-status {
                        font-size: 0.9em;
                        margin-top: 0.2em;
                    }

                    .subscription-expiry {
                        font-size: 0.8em;
                        opacity: 0.7;
                        margin-top: 0.2em;
                    }

                    .status-active {
                        color: #4CAF50;
                    }

                    .status-warning {
                        color: #FF9800;
                    }

                    .status-expired {
                        color: #F44336;
                    }
                `
            });
        } catch (error) {
            console.error('Error showing subscription modal:', error);
        }
    }
};
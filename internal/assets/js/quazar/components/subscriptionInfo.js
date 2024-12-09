import { JFAGoAuth } from '../api/jfaGoAuth.js';
import { createModal } from '../ui/modal.js';

export const SubscriptionInfo = {
    create() {
        const button = document.createElement('button');
        button.className = 'listItem listItem-autoactive itemAction listItem-button listItemCursor listItem-hoverable navMenuOption navDrawerListItem';
        button.setAttribute('data-action', 'custom');
        button.setAttribute('data-custom', 'subscription-info');
        button.setAttribute('type', 'button');
        
        button.innerHTML = this.renderButton('Abonnement');
        button.addEventListener('click', () => this.showSubscriptionModal());
        
        return button;
    },

    renderButton(status, icon = 'account_circle') {
        return `
            <div title="Abonnement" class="navMenuOption-listItem-content listItem-content listItem-content-bg listItemContent-touchzoom">
                <div data-action="custom" class="navDrawerListItemImageContainer listItemImageContainer listItemImageContainer-margin listItemImageContainer-square" style="aspect-ratio:1">
                    <i class="navDrawerListItemIcon listItemIcon md-icon autortl">${icon}</i>
                </div>
                <div class="navDrawerListItemBody listItemBody listItemBody-1-lines">
                    <div class="listItemBodyText listItemBodyText-nowrap listItemBodyText-lf">${status}</div>
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
                        <div class="how-it-works-section">
                            <h3><i class="md-icon">${statusIcon}</i>Abonnement:</h3>
                                <div class="status-info">
                                    <div class="status-value">${statusText}</div>
                                    <div class="expiry-date">Date d'expiration : ${expiryDate.toLocaleDateString('fr-FR')}</div>
                                </div>
                        </div>

                        <div class="how-it-works-section">
                            <h3><i class="md-icon">info</i> Renouvellement</h3>
                            <ol>
                                <li>Envoyez un email à contact@quazar.cx pour demander un renouvellement</li>
                                <li>Vous recevrez un lien de paiement avec les différentes options de durée</li>
                                <li>Effectuez le paiement via le lien sécurisé</li>
                                <li>Votre abonnement sera mis à jour dans les plus bref délais</li>
                            </ol>
                        </div>

                        <div class="how-it-works-section">
                            <h3><i class="md-icon">support_agent</i> Support</h3>
                            <p>Pour toute assistance concernant votre abonnement :</p>
                            <ul>
                                <li>Email : support@quazar.cx</li>
                            </ul>
                        </div>
                    </div>
                `,
                customStyles: `
                    .subscription-modal {
                        max-width: 800px;
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

                    .subscription-status {
                        padding: 1em;
                        border-radius: 10px;
                        background: rgba(0, 0, 0, 0.2);
                    }

                    .status-value {
                        font-size: 1.4em;
                        font-weight: 500;
                        margin-bottom: 0.3em;
                    }

                    .expiry-date {
                        color: rgba(255, 255, 255, 0.7);
                    }

                    .status-active .status-value {
                        color: #4CAF50;
                    }

                    .status-warning .status-value {
                        color: #FF9800;
                    }

                    .status-expired .status-value {
                        color: #F44336;
                    }

                    .how-it-works-section ol,
                    .how-it-works-section ul {
                        margin: 0.5em 0;
                        padding-left: 1.5em;
                    }

                    .how-it-works-section li {
                        margin: 0.5em 0;
                        color: rgba(255, 255, 255, 0.9);
                    }

                    .how-it-works-section p {
                        margin: 0.5em 0;
                        color: rgba(255, 255, 255, 0.9);
                    }

                    .how-it-works-section a {
                        color: var(--theme-primary-color);
                        text-decoration: none;
                    }

                    .how-it-works-section a:hover {
                        text-decoration: underline;
                    }
                `
            });
        } catch (error) {
            console.error('Error showing subscription modal:', error);
        }
    }
};
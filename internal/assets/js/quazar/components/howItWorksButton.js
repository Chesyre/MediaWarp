export const HowItWorksButton = {
    create() {
        const button = document.createElement('button');
        button.className = 'listItem listItem-autoactive itemAction listItem-button listItemCursor listItem-hoverable navMenuOption navDrawerListItem';
        button.setAttribute('data-action', 'custom');
        button.setAttribute('data-custom', 'how-it-works-button');
        button.setAttribute('type', 'button');
        
        button.innerHTML = `
            <div title="Comment ça marche ?" class="navMenuOption-listItem-content listItem-content listItem-content-bg listItemContent-touchzoom">
                <div data-action="custom" class="navDrawerListItemImageContainer listItemImageContainer listItemImageContainer-margin listItemImageContainer-square" style="aspect-ratio:1">
                    <i class="navDrawerListItemIcon listItemIcon md-icon autortl">help_outline</i>
                </div>
                <div class="navDrawerListItemBody listItemBody listItemBody-1-lines">
                    <div class="listItemBodyText listItemBodyText-nowrap listItemBodyText-lf">Comment ça marche ?</div>
                </div>
            </div>
        `;

        button.addEventListener('click', () => this.showHowItWorksModal());
        return button;
    },

    getPlatformInstructions() {
        return {
            android: {
                title: 'Android',
                icon: 'android',
                steps: [
                    {
                        title: "Installation de l'application",
                        items: [
                            "Allez dans Paramètres > Sécurité",
                            'Activez "Sources inconnues"',
                            'Téléchargez l\'application : <a href="https://dl.quazar.cx/quazar-android.apk" class="download-link"><i class="md-icon">download</i> Télécharger l\'APK</a>',
                            'Installez l\'application téléchargée',
                            'Désactivez "Sources inconnues" après l\'installation'
                        ]
                    },
                    {
                        title: "Configuration",
                        items: [
                            'Ouvrez l\'application Quazar',
                            'À l\'écran de bienvenue, cliquez sur "Suivant"',
                            'Lorsque l\'option de connexion avec Emby Connect apparaît, cliquez sur "Passer"',
                            'Sur la page "Connexion au serveur", entrez :',
                            '- Hôte : https://play.quazar.cx/',
                            '- Supprimez le numéro de port "8096"',
                            'Cliquez sur "Se connecter"',
                            'Entrez vos identifiants Quazar',
                            'Validez la connexion'
                        ]
                    }
                ]
            },
            androidtv: {
                title: 'Android TV',
                icon: 'tv',
                steps: [
                    {
                        title: "Installation de l'application",
                        items: [
                            'Installez une application de transfert de fichiers (comme Send Files to TV)',
                            'Téléchargez l\'application : <a href="https://dl.quazar.cx/quazar-android-tv.apk" class="download-link"><i class="md-icon">download</i> Télécharger l\'APK TV</a>',
                            'Transférez l\'APK sur votre TV',
                            'Installez un explorateur de fichiers si nécessaire',
                            'Activez l\'installation depuis des sources inconnues',
                            'Installez l\'application'
                        ]
                    },
                    {
                        title: "Configuration",
                        items: [
                            'Ouvrez l\'application Quazar',
                            'Cliquez sur "Ignorer et saisir l\'adresse ip" (ou "Passer", selon la version)',
                            'Sur la page de connexion au serveur :',
                            '- Entrez : https://play.quazar.cx/',
                            '- Supprimez le port "8096"',
                            'Cliquez sur "Se connecter"',
                            'Sélectionnez "Ajouter un utilisateur manuellement"',
                            'Entrez votre nom d\'utilisateur',
                            'Entrez votre mot de passe',
                            'Validez la connexion'
                        ]
                    }
                ]
            },
            windows: {
                title: 'Windows',
                icon: 'computer',
                steps: [
                    {
                        title: "Installation et configuration",
                        items: [
                            'Téléchargez l\'application : <a href="https://dl.quazar.cx/quazar.exe" class="download-link"><i class="md-icon">download</i> Télécharger l\'installateur</a>',
                            'Exécutez l\'installateur',
                            'Lancez l\'application',
                            'Connectez-vous avec vos identifiants Quazar'
                        ]
                    }
                ]
            },
            appletv: {
                title: 'Apple TV',
                icon: 'smart_display',
                steps: [
                    {
                        title: "Installation de l'application",
                        items: [
                            'Ouvrez l\'App Store sur votre Apple TV',
                            'Recherchez "Emby"',
                            'Téléchargez l\'application officielle Emby'
                        ]
                    },
                    {
                        title: "Configuration",
                        items: [
                            'Lancez l\'application Emby',
                            'Ignorez la connexion Emby Connect',
                            'Dans la configuration manuelle :',
                            '- Adresse : https://play.quazar.cx/',
                            '- Ne pas spécifier de port',
                            'Entrez vos identifiants Quazar',
                            'Validez la connexion'
                        ]
                    }
                ]
            },
            roku: {
                title: 'Roku',
                icon: 'connected_tv',
                steps: [
                    {
                        title: "Installation de l'application",
                        items: [
                            'Sur votre Roku, accédez à la boutique de chaînes',
                            'Recherchez "Emby"',
                            'Sélectionnez et installez l\'application Emby'
                        ]
                    },
                    {
                        title: "Configuration",
                        items: [
                            'Ouvrez l\'application Emby',
                            'Cliquez sur "Ignorer et saisir l\'adresse ip" (ou "Passer", selon la version)',
                            'Sur la page de connexion au serveur :',
                            '- Entrez : https://play.quazar.cx/',
                            '- Supprimez le port "8096"',
                            'Cliquez sur "Se connecter"',
                            'Sélectionnez "Ajouter un utilisateur manuellement"',
                            'Entrez votre nom d\'utilisateur',
                            'Entrez votre mot de passe',
                            'Validez la connexion'
                        ]
                    }
                ]
            },
            smarttv: {
                title: 'Smart TV (LG/Samsung)',
                icon: 'tv',
                steps: [
                    {
                        title: "Installation de l'application",
                        items: [
                            'Disponible uniquement pour LG et Samsung Smart TV',
                            'Accédez au magasin d\'applications de votre TV',
                            'Recherchez et installez "Emby"'
                        ]
                    },
                    {
                        title: "Configuration",
                        items: [
                            'Ouvrez l\'application Emby',
                            'Cliquez sur "Ignorer et saisir l\'adresse ip" (ou "Passer", selon la version)',
                            'Sur la page de connexion au serveur :',
                            '- Entrez : https://play.quazar.cx/',
                            '- Supprimez le port "8096"',
                            'Cliquez sur "Se connecter"',
                            'Sélectionnez "Ajouter un utilisateur manuellement"',
                            'Entrez votre nom d\'utilisateur',
                            'Entrez votre mot de passe',
                            'Validez la connexion'
                        ]
                    }
                ]
            }
        };
    },

    showHowItWorksModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.style.display = 'block';
        
        const platforms = this.getPlatformInstructions();
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Comment ça marche ?</h2>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div class="how-it-works-section">
                        <h3><i class="md-icon">lock</i> Club privé</h3>
                        <ul>
                            <li>Quazar est un club privé fonctionnant exclusivement par parrainage</li>
                            <li>Pour inviter quelqu'un, demandez-lui de contacter contact@quazar.cx en mentionnant votre email</li>
                        </ul>
                    </div>

                    <div class="how-it-works-section">
                        <h3><i class="md-icon">devices</i> Installation et configuration</h3>
                        <p>Sélectionnez votre plateforme pour voir les instructions détaillées :</p>
                        
                        <div class="platform-selector">
                            ${Object.entries(platforms).map(([key, platform]) => `
                                <button class="platform-button" data-platform="${key}">
                                    <i class="md-icon">${platform.icon}</i>
                                    ${platform.title}
                                </button>
                            `).join('')}
                        </div>

                        <div class="platform-instructions">
                            ${Object.entries(platforms).map(([key, platform]) => `
                                <div class="platform-content" data-platform="${key}">
                                    ${platform.steps.map(step => `
                                        <div class="instruction-step">
                                            <h4>${step.title}</h4>
                                            <ol>
                                                ${step.items.map(item => `<li>${item}</li>`).join('')}
                                            </ol>
                                        </div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="how-it-works-section">
                        <h3><i class="md-icon">movie_filter</i> Demandes de contenu</h3>
                        <p>Pour demander un nouveau film ou une série :</p>
                        <ol>
                            <li>Utilisez le bouton "Faire une requête" dans le menu</li>
                            <li>Recherchez le titre souhaité</li>
                            <li>Cliquez sur "Demander"</li>
                        </ol>
                        <div class="note">
                            <strong>Note :</strong> Le délai d'ajout peut varier selon la disponibilité du contenu.
                        </div>
                    </div>

                    <div class="how-it-works-section">
                        <h3><i class="md-icon">error_outline</i> Signalement de problèmes</h3>
                        <p>Pour signaler un problème avec un contenu :</p>
                        <ol>
                            <li>Ouvrez la page du film ou de la série</li>
                            <li>Cliquez sur "Signaler un problème"</li>
                            <li>Sélectionnez le type de problème</li>
                            <li>Décrivez le problème rencontré</li>
                        </ol>
                    </div>

                    <div class="how-it-works-section">
                        <h3><i class="md-icon">support_agent</i> Support</h3>
                        <p>Pour toute assistance :</p>
                        <ul>
                            <li>Email : support@quazar.cx</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .how-it-works-section {
                margin-bottom: 2em;
                padding: 1.5em;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 15px;
            }

            .how-it-works-section h3 {
                display: flex;
                align-items: center;
                gap: 0.5em;
                margin: 0 0 1em 0;
                color: var(--theme-primary-color);
                font-size: 1.3em;
            }

            .how-it-works-section h4 {
                margin: 1em 0 0.5em 0;
                color: var(--theme-primary-color);
                font-size: 1.1em;
            }

            .platform-selector {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5em;
                margin: 1em 0;
            }

            .platform-button {
                display: flex;
                align-items: center;
                gap: 0.5em;
                padding: 0.5em 1em;
                background: rgba(0, 0, 0, 0.2);
                border: 2px solid transparent;
                border-radius: 20px;
                color: white;
                cursor: pointer;
                transition: all 0.2s;
            }

            .platform-button:hover {
                background: rgba(0, 0, 0, 0.3);
            }

            .platform-button.active {
                background: var(--theme-primary-color);
                border-color: white;
            }

            .platform-content {
                display: none;
                margin-top: 1em;
                padding: 1em;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
            }

            .platform-content.active {
                display: block;
            }

            .instruction-step {
                margin-bottom: 1.5em;
            }

            .instruction-step:last-child {
                margin-bottom: 0;
            }

            .download-link {
                display: inline-flex;
                align-items: center;
                gap: 0.5em;
                padding: 0.5em 1em;
                margin: 0.5em 0;
                background: var(--theme-primary-color);
                color: white;
                text-decoration: none;
                border-radius: 20px;
                transition: opacity 0.2s;
            }

            .download-link:hover {
                opacity: 0.9;
            }

            .note {
                margin-top: 1em;
                padding: 1em;
                background: rgba(255, 193, 7, 0.1);
                border-left: 4px solid #ffc107;
                border-radius: 4px;
            }

            .how-it-works-section ul, 
            .how-it-works-section ol {
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
        `;
        document.head.appendChild(style);

        // Platform selection functionality
        const platformButtons = modal.querySelectorAll('.platform-button');
        const platformContents = modal.querySelectorAll('.platform-content');

        function showPlatform(platformKey) {
            platformButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.platform === platformKey);
            });
            platformContents.forEach(content => {
                content.classList.toggle('active', content.dataset.platform === platformKey);
            });
        }

        platformButtons.forEach(button => {
            button.addEventListener('click', () => {
                showPlatform(button.dataset.platform);
            });
        });

        // Show first platform by default
        showPlatform('android');

        // Close button functionality
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => modal.remove());

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        }, { once: true });

        document.body.appendChild(modal);
    }
};
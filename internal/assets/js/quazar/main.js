// Main application entry point
(function() {
    const baseModules = [
        import('./config/config.js'),
        import('./constants/mediaStatus.js'),
        import('./api/apiClient.js'),
        import('./api/mediaApi.js'),
        import('./api/jellyseerrAuth.js'),
        import('./api/jfaGoAuth.js'),
        import('./ui/modal.js'),
        import('./components/requestButton.js'),
        import('./components/reportButton.js'),
        import('./components/howItWorksButton.js'),
        import('./components/supportButton.js'),
        import('./components/subscriptionInfo.js'),
        import('./utils/favicon.js')
    ];

    // Load base modules in parallel
    Promise.all(baseModules)
        .then(([
            { CONFIG },
            { MediaStatus },
            { ApiClient },
            { MediaAPI },
            { JellyseerrAuth },
            { JFAGoAuth },
            { SearchModal },
            { RequestButton },
            { ReportButton },
            { HowItWorksButton },
            { SupportButton },
            { SubscriptionInfo },
            { setFavicon }
        ]) => {
            // Login form integration
            function setupLoginIntegration() {
                const loginForm = document.querySelector('form');
                if (!loginForm) return;

                const usernameInput = document.querySelector('.txtUserName');
                const passwordInput = document.querySelector('.txtPassword');
                if (!usernameInput || !passwordInput) return;

                // Handle form submission
                loginForm.addEventListener('submit', async (e) => {
                    // Don't prevent default - let Emby handle its own login
                    // Just handle Jellyseerr and JFA-GO login in parallel
                    const username = usernameInput.value;
                    const password = passwordInput.value;

                    try {
                        await Promise.all([
                            JellyseerrAuth.login(username, password),
                            JFAGoAuth.login(username, password)
                        ]);
                    } catch (error) {
                        console.error('Auth error:', error);
                    }
                });
            }

            // Button Management
            function addButtons() {
                const menuItems = document.querySelector('.navDrawerItemsContainer');
                if (!menuItems) {
                    setTimeout(addButtons, 1000);
                    return;
                }

                // Remove existing buttons
                const existingButtons = menuItems.querySelectorAll('[data-custom]');
                existingButtons.forEach(button => button.remove());

                // Create buttons
                const requestButton = RequestButton.create();
                requestButton.addEventListener('click', () => SearchModal.show());

                const howItWorksButton = HowItWorksButton.create();
                const supportButton = SupportButton.create();
                const subscriptionInfo = SubscriptionInfo.create();

                // Insert buttons
                const searchButton = menuItems.querySelector('[data-action="search"]');
                if (searchButton) {
                    searchButton.parentNode.insertBefore(subscriptionInfo, searchButton.nextSibling);
                    searchButton.parentNode.insertBefore(supportButton, subscriptionInfo);
                    searchButton.parentNode.insertBefore(howItWorksButton, supportButton);
                    searchButton.parentNode.insertBefore(requestButton, howItWorksButton);
                } else {
                    menuItems.appendChild(requestButton);
                    menuItems.appendChild(howItWorksButton);
                    menuItems.appendChild(supportButton);
                    menuItems.appendChild(subscriptionInfo);
                }
            }

            // Initialize
            function init() {
                try {
                    SearchModal.init();
                    ReportButton.init();
                    addButtons();
                    setFavicon();
                    setupLoginIntegration();
                    
                    // Watch for DOM changes
                    const observer = new MutationObserver(() => {
                        if (!document.querySelector('[data-custom]')) {
                            addButtons();
                        }
                        if (document.querySelector('form')) {
                            setupLoginIntegration();
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });

                    window.addEventListener('hashchange', () => {
                        addButtons();
                        setupLoginIntegration();
                    });
                    window.addEventListener('popstate', () => {
                        addButtons();
                        setupLoginIntegration();
                    });
                } catch (error) {
                    console.error('Error during initialization:', error);
                }
            }

            // Start the application
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })
        .catch(error => {
            console.error('Error loading modules:', error);
        });
})();
// Main application entry point
(function() {
    const baseModules = [
        import('./config/config.js'),
        import('./constants/mediaStatus.js'),
        import('./api/apiClient.js'),
        import('./api/mediaApi.js'),
        import('./ui/modal.js'),
        import('./components/requestButton.js'),
        import('./components/reportButton.js'),
        import('./components/howItWorksButton.js'),
        import('./utils/favicon.js')
    ];

    // Load base modules in parallel
    Promise.all(baseModules)
        .then(([
            { CONFIG },
            { MediaStatus },
            { ApiClient },
            { MediaAPI },
            { SearchModal },
            { RequestButton },
            { ReportButton },
            { HowItWorksButton },
            { setFavicon }
        ]) => {
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

                // Add request button
                const requestButton = RequestButton.create();
                requestButton.addEventListener('click', () => SearchModal.show());

                // Add how it works button
                const howItWorksButton = HowItWorksButton.create();

                // Insert buttons
                const searchButton = menuItems.querySelector('[data-action="search"]');
                if (searchButton) {
                    searchButton.parentNode.insertBefore(howItWorksButton, searchButton.nextSibling);
                    searchButton.parentNode.insertBefore(requestButton, howItWorksButton);
                } else {
                    menuItems.appendChild(requestButton);
                    menuItems.appendChild(howItWorksButton);
                }
            }

            // Initialize
            function init() {
                try {
                    SearchModal.init();
                    ReportButton.init();
                    addButtons();
                    setFavicon();
                    
                    // Watch for DOM changes to maintain buttons
                    const observer = new MutationObserver(() => {
                        if (!document.querySelector('[data-custom]')) {
                            addButtons();
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });

                    window.addEventListener('hashchange', addButtons);
                    window.addEventListener('popstate', addButtons);
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
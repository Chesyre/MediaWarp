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
            { setFavicon }
        ]) => {
            // Button Management
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

                const button = RequestButton.create();
                button.addEventListener('click', () => SearchModal.show());

                const searchButton = menuItems.querySelector('[data-action="search"]');
                if (searchButton) {
                    searchButton.parentNode.insertBefore(button, searchButton.nextSibling);
                } else {
                    menuItems.appendChild(button);
                }
            }

            // Initialize
            function init() {
                try {
                    SearchModal.init();
                    ReportButton.init();
                    addRequestButton();
                    setFavicon(); // Set the standard favicon
                    
                    // Watch for DOM changes to maintain request button
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
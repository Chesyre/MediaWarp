// Main application entry point
(function() {
    const baseModules = [
        import('./config/config.js'),
        import('./constants/mediaStatus.js'),
        import('./api/apiClient.js'),
        import('./api/mediaApi.js'),
        import('./ui/modal.js'),
        import('./components/requestButton.js')
    ];

    // Load base modules in parallel
    Promise.all(baseModules)
        .then(([
            { CONFIG },
            { MediaStatus },
            { ApiClient },
            { MediaAPI },
            { Modal },
            { RequestButton }
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
                button.addEventListener('click', () => Modal.show());

                const searchButton = menuItems.querySelector('[data-action="search"]');
                if (searchButton) {
                    searchButton.parentNode.insertBefore(button, searchButton.nextSibling);
                } else {
                    menuItems.appendChild(button);
                }
            }

            // Load report button module only when needed
            async function loadReportButton() {
                if (document.querySelector('.directors')) {
                    try {
                        const { ReportButton } = await import('./components/reportButton.js');
                        ReportButton.init();
                    } catch (error) {
                        console.error('Error loading report button:', error);
                    }
                }
            }

            // Initialize
            function init() {
                try {
                    Modal.init();
                    addRequestButton();
                    
                    // Check for report button conditions
                    loadReportButton();
                    
                    // Initialize report button when on item detail page
                    const observer = new MutationObserver(() => {
                        if (!document.querySelector('[data-custom="request-button"]')) {
                            addRequestButton();
                        }
                        loadReportButton();
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });

                    window.addEventListener('hashchange', () => {
                        addRequestButton();
                        loadReportButton();
                    });
                    
                    window.addEventListener('popstate', () => {
                        addRequestButton();
                        loadReportButton();
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
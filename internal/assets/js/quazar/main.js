// Main application entry point
(function() {
    import('./config/config.js').then(({ CONFIG }) => {
        import('./constants/mediaStatus.js').then(({ MediaStatus }) => {
            import('./api/apiClient.js').then(({ ApiClient }) => {
                import('./api/mediaApi.js').then(({ MediaAPI }) => {
                    import('./ui/modal.js').then(({ Modal }) => {
                        import('./components/requestButton.js').then(({ RequestButton }) => {
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

                            // Initialize
                            function init() {
                                Modal.init();
                                addRequestButton();

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
                            }

                            // Start the application
                            if (document.readyState === 'loading') {
                                document.addEventListener('DOMContentLoaded', init);
                            } else {
                                init();
                            }
                        });
                    });
                });
            });
        });
    });
})();
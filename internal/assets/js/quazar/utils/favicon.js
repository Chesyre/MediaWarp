export async function setFavicon() {
    try {
        // Remove existing favicon if it exists
        const existingFavicons = document.querySelectorAll("link[rel*='icon']");
        existingFavicons.forEach(favicon => favicon.remove());

        // Create new favicon link element
        const favicon = document.createElement('link');
        favicon.rel = 'shortcut icon';
        favicon.type = 'image/x-icon';
        favicon.href = 'https://dl.quazar.cx/quazar.ico';

        // Add the new favicon to the head
        document.head.appendChild(favicon);
    } catch (error) {
        console.error('Error setting favicon:', error);
    }
}
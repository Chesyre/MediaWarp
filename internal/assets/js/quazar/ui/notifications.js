export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 30px;
        color: white;
        z-index: 1100;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(220, 53, 69, 0.9)'};
        backdrop-filter: blur(8px);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
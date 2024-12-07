export const styles = `
    .custom-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        backdrop-filter: blur(8px);
    }

    .modal-content {
        position: relative;
        background-color: rgb(28, 28, 28);
        margin: 2% auto;
        padding: 25px;
        width: 90%;
        max-width: 1200px;
        border-radius: 30px;
        max-height: 90vh;
        overflow-y: auto;
        overflow-x: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header h2 {
        margin: 0;
        color: #fff;
        font-size: 1.8em;
        font-weight: normal;
    }

    .close-button {
        background: none;
        border: none;
        color: #fff;
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .close-button:hover {
        opacity: 1;
    }

    .search-container {
        margin-bottom: 20px;
    }

    .search-input-container {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    #searchInput {
        flex: 1;
        padding: 0.6em 1em;
        border: none;
        border-radius: 30px;
        background: rgba(0, 0, 0, 0.2);
        color: #fff;
        font-size: 1.1em;
    }

    #searchInput:focus {
        outline: none;
        background: rgba(0, 0, 0, 0.3);
    }

    .search-button {
        background: rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 30px;
        padding: 0.6em 1.2em;
        cursor: pointer;
        color: white;
        transition: background 0.2s;
    }

    .search-button:hover {
        background: rgba(0, 0, 0, 0.3);
    }

    .filter-container {
        color: rgba(255, 255, 255, 0.7);
        margin-top: 1em;
    }

    .filter-container label {
        display: flex;
        align-items: center;
        gap: 0.5em;
        cursor: pointer;
    }

    .result-item {
        background: rgba(0, 0, 0, 0.2);
        margin-bottom: 1em;
        border-radius: 30px;
        overflow: hidden;
        transition: transform 0.2s;
    }

    .result-item:hover {
        transform: translateY(-2px);
    }

    .result-content {
        display: flex;
        gap: 25px;
        padding: 1.5em;
    }

    .image-container {
        position: relative;
        flex-shrink: 0;
        width: 150px;
        height: 225px;
        border-radius: 15px;
        overflow: hidden;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .status-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 12px;
        border-radius: 30px;
        font-size: 0.8em;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        backdrop-filter: blur(4px);
    }

    .status-badge.available {
        background: rgba(40, 167, 69, 0.8);
    }

    .status-badge.pending {
        background: rgba(255, 193, 7, 0.8);
    }

    .status-badge.processing {
        background: rgba(23, 162, 184, 0.8);
    }

    .status-badge.partial {
        background: rgba(108, 117, 125, 0.8);
    }

    .status-badge.not-available {
        background: rgba(220, 53, 69, 0.8);
    }

    .result-info {
        flex: 1;
    }

    .media-type-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 30px;
        background: rgba(115, 115, 115, 0.5);
        backdrop-filter: blur(1.5em) saturate(1.8);
        color: #fff;
        font-size: 0.9em;
        margin-bottom: 0.5em;
    }

    .result-title {
        margin: 0.5em 0;
        font-size: 1.4em;
        color: #fff;
        font-weight: normal;
    }

    .result-overview {
        color: rgba(255, 255, 255, 0.7);
        margin: 1em 0;
        line-height: 1.5;
    }

    .request-button {
        background: rgba(115, 115, 115, 0.5);
        backdrop-filter: blur(1.5em) saturate(1.8);
        border: none;
        border-radius: 30px;
        padding: 0.6em 1.2em;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 1em;
    }

    .request-button:hover:not(:disabled) {
        background: var(--theme-primary-color);
        transform: translateY(-1px);
    }

    .request-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 30px;
        color: white;
        z-index: 1100;
        animation: slideIn 0.3s ease-out;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(8px);
    }

    .notification.success {
        background: rgba(40, 167, 69, 0.9);
    }

    .notification.error {
        background: rgba(220, 53, 69, 0.9);
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .loading-spinner {
        display: none;
        width: 40px;
        height: 40px;
        margin: 20px auto;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .no-results {
        text-align: center;
        color: rgba(255, 255, 255, 0.5);
        padding: 40px;
    }
`;
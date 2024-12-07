import { CONFIG } from '../config/config.js';

export const ApiClient = {
    async makeRequest(endpoint, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'X-Api-Key': CONFIG.API_KEY,
                'Accept': 'application/json'
            }
        };

        try {
            const response = await fetch(`${CONFIG.JELLYSEERR_API_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: { ...defaultOptions.headers, ...options.headers }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur API: ${endpoint}`, error);
            throw error;
        }
    }
};
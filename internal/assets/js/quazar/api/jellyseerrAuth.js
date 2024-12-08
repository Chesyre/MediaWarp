import { CONFIG } from '../config/config.js';

export const JellyseerrAuth = {
    async login(username, password) {
        try {
            // First logout any existing session
            await this.logout();
            
            // Then attempt login
            const response = await fetch(`${CONFIG.JELLYSEERR_API_URL}/auth/jellyfin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Authentication failed');
            }

            const authData = await response.json();
            if (authData.jellyfinAuthToken) {
                localStorage.setItem('jellyseerrAuthToken', authData.jellyfinAuthToken);
            }

            return authData;
        } catch (error) {
            console.error('Jellyseerr login error:', error);
            return null;
        }
    },

    async logout() {
        try {
            localStorage.removeItem('jellyseerrAuthToken');
            await fetch(`${CONFIG.JELLYSEERR_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Jellyseerr logout error:', error);
        }
    },

    getAuthToken() {
        return localStorage.getItem('jellyseerrAuthToken');
    }
};
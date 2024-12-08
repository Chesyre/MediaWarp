import { CONFIG } from '../config/config.js';

export const JFAGoAuth = {
    async login(username, password) {
        try {
            // First logout any existing session
            await this.logout();
            
            // Then get new token
            const response = await fetch(`${CONFIG.JFA_GO_API_URL}/my/token/login`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(username + ':' + password)
                }
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('jfaGoAuthToken', data.token);
            }

            return data;
        } catch (error) {
            console.error('JFA-GO login error:', error);
            return null;
        }
    },

    async logout() {
        try {
            const token = this.getAuthToken();
            if (!token) return;

            localStorage.removeItem('jfaGoAuthToken');
            
            await fetch(`${CONFIG.JFA_GO_API_URL}/my/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('JFA-GO logout error:', error);
        }
    },

    getAuthToken() {
        return localStorage.getItem('jfaGoAuthToken');
    },

    async getUserDetails() {
        try {
            const token = this.getAuthToken();
            if (!token) return null;

            const response = await fetch(`${CONFIG.JFA_GO_API_URL}/my/details`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get user details');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting user details:', error);
            return null;
        }
    }
};
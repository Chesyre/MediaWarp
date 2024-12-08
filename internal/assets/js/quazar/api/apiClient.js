import { CONFIG } from '../config/config.js';
import { JellyseerrAuth } from './jellyseerrAuth.js';

export const ApiClient = {
    async makeRequest(endpoint, options = {}) {
        try {
            const defaultOptions = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            };

            // Add auth token if available
            const authToken = JellyseerrAuth.getAuthToken();
            if (authToken) {
                defaultOptions.headers['X-Auth-Token'] = authToken;
            }

            const response = await fetch(`${CONFIG.JELLYSEERR_API_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: { ...defaultOptions.headers, ...options.headers }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const userId = window.ApiClient._serverInfo.UserId;
            const userInfo = await window.ApiClient.getUser(userId);
            return userInfo;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    async getAuthState() {
        try {
            const response = await this.makeRequest('/auth/me');
            return response;
        } catch (error) {
            return null;
        }
    },

    async authenticate() {
        try {
            const userInfo = await this.getCurrentUser();
            if (!userInfo) {
                throw new Error('Unable to get current user information');
            }

            const authState = await this.getAuthState();
            if (authState) {
                return authState;
            }

            const response = await fetch(`${CONFIG.JELLYSEERR_API_URL}/auth/local`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userInfo.Name + '@quazar.local',
                    password: 'quazar2024'
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }
};
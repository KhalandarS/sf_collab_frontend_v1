import axios from 'axios';
import { API_BASE_URL } from '../config';

export const discoveryFeedAPI = {
    getFeed: async (params = {}, token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/discovery-feed`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching discovery feed:', error);
            throw error;
        }
    }
};

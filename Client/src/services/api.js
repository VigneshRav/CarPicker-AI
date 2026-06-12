import axios from 'axios';

// Create base instance configured with Vite proxy
const API = axios.create({
  baseURL: 'https://carpicker-ai.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends preferences payload to /api/recommend backend endpoint
 */
export const getCarRecommendations = async (preferences) => {
  try {
    const response = await API.post('/recommend', preferences);
    return response.data;
  } catch (error) {
    console.error('API Error in getCarRecommendations:', error);
    throw error.response?.data || new Error('Network error or server unavailable');
  }
};

export default API;

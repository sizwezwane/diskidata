import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const searchPlayers = async (query) => {
    const response = await api.get(`/players/search/${encodeURIComponent(query)}`);
    return response.data;
};

export const getPlayerProfile = async (id) => {
    const response = await api.get(`/players/${id}/profile`);
    return response.data;
};

export const getPlayerMarketValue = async (id) => {
    const response = await api.get(`/players/${id}/market_value`);
    return response.data;
};

export const getPlayerStats = async (id) => {
    const response = await api.get(`/players/${id}/stats`);
    return response.data;
};

export default api;

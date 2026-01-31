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

// Clubs
export const searchClubs = async (query) => {
    const response = await api.get(`/clubs/search/${encodeURIComponent(query)}`);
    return response.data;
};

export const getClubProfile = async (id) => {
    const response = await api.get(`/clubs/${id}/profile`);
    return response.data;
};

export const getClubPlayers = async (id) => {
    const response = await api.get(`/clubs/${id}/players`);
    return response.data;
};

// Competitions
export const searchCompetitions = async (query) => {
    const response = await api.get(`/competitions/search/${encodeURIComponent(query)}`);
    return response.data;
};

export const getCompetitionClubs = async (id) => {
    const response = await api.get(`/competitions/${id}/clubs`);
    return response.data;
};

export default api;

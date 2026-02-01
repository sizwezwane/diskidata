import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Interfaces
export interface SearchResultItem {
    id: string;
    name: string;
    url?: string;
    position?: string;
    club?: string | { id: string; name: string };
    age?: string | number;
    nationality?: string[];
    marketValue?: string | number;
    country?: string | { id: string; name: string };
}

export interface SearchResponse {
    results: SearchResultItem[];
}

export interface PlayerProfile {
    id: string;
    name: string;
    imageUrl?: string;
    age?: number;
    citizenship?: string[];
    height?: string;
    foot?: string;
    shirtNumber?: string;
    currentClub?: string;
    club?: { id: string; name: string; contractExpires?: string };
    marketValue?: string | number;
    position?: string;
}

export interface PlayerStats {
    stats: {
        competitionId: string;
        competitionName: string;
        seasonId: string;
        clubId: string;
        clubName: string;
        appearances: number;
        goals: number;
        assists: number;
        yellowCards: number;
        secondYellowCards?: number;
        redCards: number;
        minutesPlayed: number;
        substitutionsOn?: number;
        substitutionsOff?: number;
        cleanSheets?: number;
        goalsConceded?: number;
        pointsPerMatch?: string;
    }[];
}

export interface PlayerMarketValue {
    marketValue: string | number;
    marketValueUnformatted?: number;
}

export interface ClubProfile {
    id: string;
    name: string;
    league?: { name: string };
    country?: string;
    totalMarketValue?: string;
}

export interface SquadPlayer {
    id: string;
    name: string;
    position: string;
    age: number;
    nationality: string[];
    marketValue: string;
}

export interface ClubPlayers {
    players: SquadPlayer[];
}

export interface CompetitionClub {
    id: string;
    name: string;
}

export interface CompetitionClubs {
    id: string;
    name: string;
    season_id: string;
    clubs: CompetitionClub[];
}

export interface CompetitionTableRow {
    rank: number;
    clubId: string;
    clubName: string;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsForAgainst: string;
    goalDifference: string;
    points: number;
}

export interface CompetitionTable {
    id: string;
    table: CompetitionTableRow[];
}

export interface KnockoutMatch {
    roundName: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    homeTeamId?: string;
    awayTeamId?: string;
}

export interface KnockoutRound {
    roundName: string;
    matches: KnockoutMatch[];
}

export interface CompetitionKnockout {
    id: string;
    rounds: KnockoutRound[];
}

export interface CompetitionFixture {
    date?: string;
    time?: string;
    homeTeamId?: string;
    homeTeamName?: string;
    awayTeamId?: string;
    awayTeamName?: string;
    score?: string;
    matchday?: string;
}

export interface CompetitionFixtures {
    id: string;
    fixtures: CompetitionFixture[];
}

export interface CompetitionScorer {
    rank: number;
    playerId?: string;
    playerName: string;
    position?: string;
    clubId?: string;
    clubName?: string;
    games: number;
    goals: number;
    assists: number;
    points: number;
}

export interface CompetitionScorers {
    id: string;
    scorers: CompetitionScorer[];
}

// API Functions
export const searchPlayers = async (query: string): Promise<SearchResponse> => {
    const response = await api.get<SearchResponse>(`/players/search/${encodeURIComponent(query)}`);
    return response.data;
};

export const getPlayerProfile = async (id: string): Promise<PlayerProfile> => {
    const response = await api.get<PlayerProfile>(`/players/${id}/profile`);
    return response.data;
};

export const getPlayerMarketValue = async (id: string): Promise<PlayerMarketValue> => {
    const response = await api.get<PlayerMarketValue>(`/players/${id}/market_value`);
    return response.data;
};

export const getPlayerStats = async (id: string): Promise<PlayerStats> => {
    const response = await api.get<PlayerStats>(`/players/${id}/stats`);
    return response.data;
};

// Clubs
export const searchClubs = async (query: string): Promise<SearchResponse> => {
    const response = await api.get<SearchResponse>(`/clubs/search/${encodeURIComponent(query)}`);
    return response.data;
};

export const getClubProfile = async (id: string): Promise<ClubProfile> => {
    const response = await api.get<ClubProfile>(`/clubs/${id}/profile`);
    return response.data;
};

export const getClubPlayers = async (id: string): Promise<ClubPlayers> => {
    const response = await api.get<ClubPlayers>(`/clubs/${id}/players`);
    return response.data;
};

// Competitions
export const searchCompetitions = async (query: string): Promise<SearchResponse> => {
    const response = await api.get<SearchResponse>(`/competitions/search/${encodeURIComponent(query)}`);
    return response.data;
};

export const getCompetitionClubs = async (id: string, seasonId?: string): Promise<CompetitionClubs> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<CompetitionClubs>(`/competitions/${id}/clubs`, { params });
    return response.data;
};

export const getCompetitionTable = async (id: string, seasonId?: string): Promise<CompetitionTable> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<CompetitionTable>(`/competitions/${id}/table`, { params });
    return response.data;
};

export const getCompetitionKnockout = async (id: string, seasonId?: string): Promise<CompetitionKnockout> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<CompetitionKnockout>(`/competitions/${id}/knockout`, { params });
    return response.data;
};

export const getCompetitionFixtures = async (id: string, seasonId?: string): Promise<CompetitionFixtures> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<CompetitionFixtures>(`/competitions/${id}/fixtures`, { params });
    return response.data;
};

export const getCompetitionScorers = async (id: string, seasonId?: string): Promise<CompetitionScorers> => {
    const params = seasonId ? { season_id: seasonId } : {};
    const response = await api.get<CompetitionScorers>(`/competitions/${id}/scorers`, { params });
    return response.data;
};

export default api;

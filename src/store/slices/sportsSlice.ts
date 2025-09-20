import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
}

export interface SportsState {
  teams: Team[];
  matches: Match[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SportsState = {
  teams: [],
  matches: [],
  favorites: [],
  isLoading: false,
  error: null,
};

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setTeams,
  setMatches,
  addToFavorites,
  removeFromFavorites,
  setError,
  clearError,
} = sportsSlice.actions;

export default sportsSlice.reducer;

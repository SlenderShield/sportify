import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Team, Match } from '../slices/sportsSlice';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.sportify.com/v1/',
    prepareHeaders: headers => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Teams', 'Matches', 'User'],
  endpoints: builder => ({
    getTeams: builder.query<Team[], void>({
      query: () => 'teams',
      providesTags: ['Teams'],
    }),
    getMatches: builder.query<Match[], void>({
      query: () => 'matches',
      providesTags: ['Matches'],
    }),
    getMatchById: builder.query<Match, string>({
      query: id => `matches/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Matches', id }],
    }),
    getTeamById: builder.query<Team, string>({
      query: id => `teams/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Teams', id }],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetMatchesQuery,
  useGetMatchByIdQuery,
  useGetTeamByIdQuery,
} = api;

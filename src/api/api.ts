import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Example endpoint
    getProfile: builder.query<{ id: string; name: string }, void>({
      query: () => 'profile',
    }),
  }),
});

export const { useGetProfileQuery } = api;

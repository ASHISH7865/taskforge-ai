import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a base API to handle common configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // Add any common headers or configuration
    prepareHeaders: (headers) => {
      // For example, add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  // Define any tags that can be used for cache invalidation
  tagTypes: ['Tasks', 'AITasks'],
  // No endpoints defined yet, we'll inject them from feature slices
  endpoints: () => ({}),
});

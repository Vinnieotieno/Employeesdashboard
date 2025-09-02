import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000',
  credentials: 'include',
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 responses - token expired or invalid
  if (result?.error?.status === 401) {
    // Clear user info and redirect to login
    api.dispatch(logout());
    // Optionally redirect to login page
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'Transactions', 'Products', 'Kpis', 'Services', 'Departments', 'Payments', 'Users', 'ExchangeRates', 'Plans', 'Events', 'Leave'],
  endpoints: (builder) => ({}),
  // Reduce automatic refetching to prevent infinite loops
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
});
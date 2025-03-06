import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000',
  credentials: 'include',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Transactions', 'Products', 'Kpis', 'Services', 'Departments', 'Payments', 'Users', 'ExchangeRates', 'Plans', 'Events', 'Leave'],
  endpoints: (builder) => ({}),
});
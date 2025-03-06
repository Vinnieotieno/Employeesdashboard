import { apiSlice } from './apiSlice';

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `http://localhost:8000/payments/get-driver-payments`,
        params: { startDate, endDate },
      }),
      //providesTags: ['Payments'],
    }),
    downloadExcel: builder.mutation({
      query: () => ({
        url: `/export/excel`,
        method: 'GET',
        responseHandler: (response) => response.blob(), // Handle binary response
      }),
    }),
    downloadPDF: builder.mutation({
      query: () => ({
        url: `/export/pdf`,
        method: 'GET',
        responseHandler: (response) => response.blob(), // Handle binary response
      }),
    }),
  }),
});

export const { useGetPaymentsQuery, useDownloadExcelMutation, useDownloadPDFMutation } = paymentsApiSlice;

import { apiSlice } from './apiSlice';

export const serviceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addService: builder.mutation({
            query: (data) => ({
                url: 'service/new/',
                method: 'POST',
                body: data,
            })
        }),
        getOrders: builder.query({
            query: () => 'service/orders/',
            providesTags: ['Services'],
        }),
        getSingleOrder: builder.query({
            query: (id) => `service/orders/${id}`,
            providesTags: ['Services'],
        }),
        updateService: builder.mutation({
            query: (data) => ({
                url: 'service/orders',
                method: 'PUT',
                body: data,
            }), 
        }),
        sendQuote: builder.mutation({
            query: (id) => ({
                url: `service/orders`,
                method: 'POST',
                body: id,
            }),
        }),
        uploadQuoteDocument: builder.mutation({
            query: (data) => ({
                url: 'service/document/',
                method: 'POST',
                body: data,
            })
        }),
        // Operations Board API endpoints
        getOperationsBoard: builder.query({
            query: (params = {}) => {
                const queryString = new URLSearchParams(params).toString();
                return `service/operations-board${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['OperationsBoard'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `service/operations/${id}/status`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['OperationsBoard', 'Services'],
        }),
        markAsDelivered: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `service/operations/${id}/delivered`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['OperationsBoard', 'Services'],
        }),
        generateOperationsReport: builder.query({
            query: (params = {}) => {
                const queryString = new URLSearchParams(params).toString();
                return `service/operations/reports${queryString ? `?${queryString}` : ''}`;
            },
        }),
        updateShipmentTracking: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `service/operations/${id}/tracking`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['OperationsBoard', 'Services'],
        }),
        deleteOrAbortQuote: builder.mutation({
            query: (data) => ({
                url: 'service/delete/',
                method: 'POST',
                body: data,
            })
        }),
        postExchangeRates: builder.mutation({
            query: (data) => ({
                url: 'service/exchange/',
                method: 'POST',
                body: data,
            })
        }),
        getExchangeRates: builder.query({
            query: () => 'service/exchange/',
            providesTags: ['ExchangeRates'],
        }),
        changeProgress: builder.mutation({
            query: (data) => ({
                url: 'service/progress/',
                method: 'POST',
                body: data,
            }),
        }),
        addInventory: builder.mutation({
            query: (data) => ({
                url: 'service/inventory/',
                method: 'POST',
                body: data,
            })
        }),
        getInventories: builder.query({
            query: () => 'service/inventory/',
            providesTags: ['Services'],
        }),
        getSingleInventory: builder.query({
            query: (id) => `service/inventory/${id}`,
            providesTags: ['Services'],
        }),
        updateInventory: builder.mutation({
            query: (data) => ({
                url: 'service/inventory',
                method: 'PUT',
                body: data,
            }),
        }),
        assignDriver: builder.mutation({
            query: (data) => ({
                url: 'service/assign_driver',
                method: 'POST',
                body: data,
            }),
        }),
        // ✅ Corrected placement of driver payment endpoints
        calculateDriverPayment: builder.mutation({
            query: (data) => ({
                url: 'service/calculate-payment',
                method: 'POST',
                body: data,
            }),
        }),
        getDriverPayments: builder.query({
            query: () => 'service/payments/',
            providesTags: ['Payments'],
        }),
    }),
});

export const {
    useAddServiceMutation,
    useGetOrdersQuery,
    useGetSingleOrderQuery,
    useUpdateServiceMutation,
    useSendQuoteMutation,
    useUploadQuoteDocumentMutation,
    // Operations Board API hooks
    useGetOperationsBoardQuery,
    useUpdateOrderStatusMutation,
    useMarkAsDeliveredMutation,
    useGenerateOperationsReportQuery,
    useUpdateShipmentTrackingMutation,
    useDeleteOrAbortQuoteMutation,
    usePostExchangeRatesMutation,
    useGetExchangeRatesQuery,
    useChangeProgressMutation,
    useAddInventoryMutation,
    useGetInventoriesQuery,
    useGetSingleInventoryQuery,
    useUpdateInventoryMutation,
    useAssignDriverMutation,
    useCalculateDriverPaymentMutation,
    useGetDriverPaymentsQuery
} = serviceApiSlice;

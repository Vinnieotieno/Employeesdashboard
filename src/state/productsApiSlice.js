import {apiSlice} from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        getKpis: builder.query({
            query: () => 'kpi/kpis/',
            providesTags: ['Kpis'],
          }),
          getProducts: builder.query({
            query: () => 'product/products/',
            providesTags: ['Products'],
          }),
          getTransactions: builder.query({
            query: () => 'transaction/transactions/',
            providesTags: ['Transactions'],
          }),
          addImage: builder.mutation({
            query: (data) =>({
              url:'product/image/',
              method:'POST',
              body: data,
            })
          }),
          addProduct: builder.mutation({
            query: (data) =>({
              url:'product/new-product/',
              method:'POST',
              body: data
            })
          })
    })
})
export const {
    useGetKpisQuery,
    useGetProductsQuery,
    useGetTransactionsQuery,
    useAddImageMutation,
    useAddProductMutation
  } = productsApiSlice;
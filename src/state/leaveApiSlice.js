import { apiSlice } from './apiSlice';

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Leave Application endpoints
    applyLeave: builder.mutation({
      query: (data) => ({
        url: 'leave/apply',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Leave', 'LeaveBalance']
    }),
    
    getLeaveApplications: builder.query({
      query: (params) => ({
        url: 'leave/applications',
        params
      }),
      providesTags: ['Leave']
    }),
    
    updateLeaveStatus: builder.mutation({
      query: (data) => ({
        url: 'leave/status',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Leave', 'LeaveBalance', 'Notifications']
    }),
    
    // Leave Balance endpoints
    getLeaveBalance: builder.query({
      query: (userId) => `leave/balance/${userId || ''}`,
      providesTags: ['LeaveBalance']
    }),
    
    // Leave Policy endpoints
    getLeavePolicy: builder.query({
      query: () => 'leave/policy',
      providesTags: ['LeavePolicy']
    }),
    
    createLeavePolicy: builder.mutation({
      query: (data) => ({
        url: 'leave/policy',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['LeavePolicy']
    }),
    
    updateLeavePolicy: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leave/policy/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['LeavePolicy', 'LeaveBalance']
    }),
    
    // Analytics and Reporting
    getLeaveReport: builder.query({
      query: (params) => ({
        url: 'leave/report',
        params
      }),
      providesTags: ['LeaveReport']
    }),
    
    // Notifications
    getNotifications: builder.query({
      query: () => 'notifications',
      providesTags: ['Notifications']
    }),
    
    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: 'PUT'
      }),
      invalidatesTags: ['Notifications']
    }),
    
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: 'notifications/read-all',
        method: 'PUT'
      }),
      invalidatesTags: ['Notifications']
    })
  })
});

export const {
  useApplyLeaveMutation,
  useGetLeaveApplicationsQuery,
  useUpdateLeaveStatusMutation,
  useGetLeaveBalanceQuery,
  useGetLeavePolicyQuery,
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
  useGetLeaveReportQuery,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation
} = leaveApiSlice;
import {apiSlice} from './apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        login: builder.mutation({
            query: (data) =>({
                url: 'users/auth/',
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) =>({
                url: 'users/register/',
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation({
            query:()=>({
                url:'users/logout/',
                method:'POST',

            })
        }),
        updateUser: builder.mutation({
            query: (data) =>({
                url:'users/profile/',
                method: 'PUT',
                body: data
            })
        }),
        leaveApplication: builder.mutation({
            query: (data) =>({
                url:'users/leave/',
                method: 'POST',
                body: data
            })
        }),
        getLeave: builder.query({
            query: () => 'users/leave/',
            providesTags: ['Leave'],
          }),
        getDepartments: builder.query({
            query: () => 'users/department/',
            providesTags: ['Departments'],
          }),
        getUsers: builder.query({
            query:() => 'users/all/',
            providesTags: ['Users'],
        }),  
        deleteUser: builder.mutation({
            query: (data) =>({
                url:'users/delete/',
                method:'POST',
                body: data,
            })
        }),
        createPlan: builder.mutation({
            query: (data) =>({
                url: 'users/plans/',
                method: 'POST',
                body: data
            })
        }),
        getPlans: builder.query({
            query:() => 'users/plans/',
            providesTags: ['Plans'],
        }), 
        getSinglePlan: builder.query({
            query: (id) => `users/plans/${id}`,
            providesTags: ['Plans'],
          }),

        updatePlan: builder.mutation({
        query: (data) =>({
            url:'users/plans',
            method: 'PUT',
            body: data
        }),
    }),
    addDriver: builder.mutation({
        query: (data) =>({
            url: 'users/driver/',
            method: 'POST',
            body: data
        })
    }),
    getDrivers: builder.query({
        query:() => 'users/driver/',
        providesTags: ['Users'],
    }), 
    deleteDriver: builder.mutation({
        query: (data) =>({
            url:'users/remove_driver/',
            method:'POST',
            body: data,
        })
    }),
    deletePlan: builder.mutation({
        query: (data) =>({
            url:'users/delete_plan/',
            method:'POST',
            body: data,
        })
    }),

    uploadDocument: builder.mutation({
        query: (data) =>({
            url:'users/document/',
            method:'POST',
            body: data,
          })
    }),
    
    addEvent: builder.mutation({
        query: (data) =>({
            url:'users/events/',
            method:'POST',
            body: data,
          })
    }),
    getEvents: builder.query({
        query:() => 'users/events/',
        providesTags: ['Events'],
    }),
    approveLeave: builder.mutation({
        query: (data) =>({
            url:'users/approve_leave/',
            method:'POST',
            body: data,
          })
    }),
    })
})



export const {useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation, useLeaveApplicationMutation, useGetDepartmentsQuery, useGetUsersQuery, useDeleteUserMutation, useCreatePlanMutation, useGetPlansQuery, useGetSinglePlanQuery, useUpdatePlanMutation, useAddDriverMutation, useGetDriversQuery, useDeleteDriverMutation, useDeletePlanMutation, useUploadDocumentMutation, useAddEventMutation,
useGetEventsQuery, useGetLeaveQuery, useApproveLeaveMutation} = usersApiSlice
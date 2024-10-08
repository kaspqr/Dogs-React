import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const userReportsAdapter = createEntityAdapter({})

const initialState = userReportsAdapter.getInitialState()

export const userReportsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserReports: builder.query({
            query: () => ({
                url: '/userreports',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedUserReports = responseData.map(userReport => {
                    userReport.id = userReport._id
                    return userReport
                })
                return userReportsAdapter.setAll(initialState, loadedUserReports)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'UserReport', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'UserReport', id }))
                    ]
                } else return [{ type: 'UserReport', id: 'LIST' }]
            }
        }),
        addNewUserReport: builder.mutation({
            query: initialUserReport => ({
                url: '/userreports',
                method: 'POST',
                body: {
                    ...initialUserReport,
                }
            }),
            invalidatesTags: [
                { type: 'UserReport', id: "LIST" }
            ]
        }),
        deleteUserReport: builder.mutation({
            query: ({ id }) => ({
                url: '/userreports',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'UserReport', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetUserReportsQuery,
    useAddNewUserReportMutation,
    useDeleteUserReportMutation,
} = userReportsApiSlice

export const selectUserReportsResult = userReportsApiSlice.endpoints.getUsers.select()

const selectUserReportsData = createSelector(
    selectUserReportsResult,
    userReportsResult => userReportsResult.data
)

export const {
    selectAll: selectAllUserReports,
    selectById: selectUserReportById,
    selectIds: selectUserReportIds
} = userReportsAdapter.getSelectors(state => selectUserReportsData(state) ?? initialState)

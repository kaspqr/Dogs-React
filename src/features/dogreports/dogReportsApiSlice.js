import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const dogReportsAdapter = createEntityAdapter({})

const initialState = dogReportsAdapter.getInitialState()

export const dogReportsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDogReports: builder.query({
            query: () => ({
                url: '/dogreports',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedDogReports = responseData.map(dogReport => {
                    dogReport.id = dogReport._id
                    return dogReport
                })
                return dogReportsAdapter.setAll(initialState, loadedDogReports)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'DogReport', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'DogReport', id }))
                    ]
                } else return [{ type: 'DogReport', id: 'LIST' }]
            }
        }),
        addNewDogReport: builder.mutation({
            query: initialDogReport => ({
                url: '/dogreports',
                method: 'POST',
                body: {
                    ...initialDogReport,
                }
            }),
            invalidatesTags: [
                { type: 'DogReport', id: "LIST" }
            ]
        }),
        deleteDogReport: builder.mutation({
            query: ({ id }) => ({
                url: '/dogreports',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'DogReport', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetDogReportsQuery,
    useAddNewDogReportMutation,
    useDeleteDogReportMutation,
} = dogReportsApiSlice

export const selectDogReportsResult = dogReportsApiSlice.endpoints.getDogs.select()

const selectDogReportsData = createSelector(
    selectDogReportsResult,
    dogReportsResult => dogReportsResult.data
)

export const {
    selectAll: selectAllDogReports,
    selectById: selectDogReportById,
    selectIds: selectDogReportIds
} = dogReportsAdapter.getSelectors(state => selectDogReportsData(state) ?? initialState)

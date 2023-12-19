import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const advertisementReportsAdapter = createEntityAdapter({})

const initialState = advertisementReportsAdapter.getInitialState()

export const advertisementReportsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAdvertisementReports: builder.query({
            query: () => ({
                url: '/advertisementreports',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedAdvertisementReports = responseData.map(advertisementReport => {
                    advertisementReport.id = advertisementReport._id
                    return advertisementReport
                })
                return advertisementReportsAdapter.setAll(initialState, loadedAdvertisementReports)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'AdvertisementReport', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'AdvertisementReport', id }))
                    ]
                } else return [{ type: 'AdvertisementReport', id: 'LIST' }]
            }
        }),
        addNewAdvertisementReport: builder.mutation({
            query: initialAdvertisementReport => ({
                url: '/advertisementreports',
                method: 'POST',
                body: {
                    ...initialAdvertisementReport,
                }
            }),
            invalidatesTags: [
                { type: 'AdvertisementReport', id: "LIST" }
            ]
        }),
        deleteAdvertisementReport: builder.mutation({
            query: ({ id }) => ({
                url: '/advertisementreports',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'AdvertisementReport', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetAdvertisementReportsQuery,
    useAddNewAdvertisementReportMutation,
    useDeleteAdvertisementReportMutation,
} = advertisementReportsApiSlice

export const selectAdvertisementReportsResult = advertisementReportsApiSlice.endpoints.getAdvertisements.select()

const selectAdvertisementReportsData = createSelector(
    selectAdvertisementReportsResult,
    advertisementReportsResult => advertisementReportsResult.data
)

export const {
    selectAll: selectAllAdvertisementReports,
    selectById: selectAdvertisementReportById,
    selectIds: selectAdvertisementReportIds
} = advertisementReportsAdapter.getSelectors(state => selectAdvertisementReportsData(state) ?? initialState)

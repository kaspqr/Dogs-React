import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const advertisementsAdapter = createEntityAdapter({})

const initialState = advertisementsAdapter.getInitialState()

export const advertisementsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAdvertisements: builder.query({
            query: ({
                title,
                type,
                breed,
                country,
                region,
                currency,
                lowestPrice,
                highestPrice,
                sort,
                currentPage
            }) => ({
                url: `/advertisements`,
                params: {
                    title,
                    type,
                    breed,
                    country,
                    region,
                    currency,
                    lowestPrice,
                    highestPrice,
                    priceSort: sort,
                    page: currentPage
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const { advertisements, totalPages, currentPage } = responseData;
                const loadedAdvertisements = advertisements.map(advertisement => {
                    advertisement.id = advertisement._id
                    return advertisement
                })
                
                return {
                    advertisements: advertisementsAdapter.setAll(initialState, loadedAdvertisements),
                    totalPages,
                    currentPage
                };
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Advertisement', id: 'LIST' },
                        ...result.ids?.map(id => ({ type: 'Advertisement', id }))
                    ]
                } else return [{ type: 'Advertisement', id: 'LIST' }]
            }
        }),
        getUserAdvertisements: builder.query({
            query: ({ id }) => ({
                url: `/advertisements/user/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedAdvertisements = responseData.map(advertisement => {
                    advertisement.id = advertisement._id
                    return advertisement
                })
                
                return advertisementsAdapter.setAll(initialState, loadedAdvertisements)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Advertisement', id: 'LIST' },
                        ...result.ids?.map(id => ({ type: 'Advertisement', id }))
                    ]
                } else return [{ type: 'Advertisement', id: 'LIST' }]
            }
        }),
        getAdvertisementById: builder.query({
            query: ({ id }) => ({
                url: `/advertisements/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                return {
                    ...responseData,
                    id: responseData._id
                }
            },
        }),
        addNewAdvertisement: builder.mutation({
            query: initialAdvertisement => ({
                url: '/advertisements',
                method: 'POST',
                body: {
                    ...initialAdvertisement,
                }
            }),
            invalidatesTags: [
                { type: 'Advertisement', id: "LIST" }
            ]
        }),
        updateAdvertisement: builder.mutation({
            query: initialAdvertisement => ({
                url: '/advertisements',
                method: 'PATCH',
                body: {
                    ...initialAdvertisement,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Advertisement', id: arg.id }
            ]
        }),
        deleteAdvertisement: builder.mutation({
            query: ({ id }) => ({
                url: '/advertisements',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Advertisement', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetAdvertisementsQuery,
    useGetUserAdvertisementsQuery,
    useGetAdvertisementByIdQuery,
    useAddNewAdvertisementMutation,
    useUpdateAdvertisementMutation,
    useDeleteAdvertisementMutation,
} = advertisementsApiSlice

export const selectAdvertisementsResult = advertisementsApiSlice.endpoints.getAdvertisements.select()

const selectAdvertisementsData = createSelector(
    selectAdvertisementsResult,
    advertisementsResult => advertisementsResult.data
)

export const {
    selectAll: selectAllAdvertisements,
    selectById: selectAdvertisementById,
    selectIds: selectAdvertisementIds
} = advertisementsAdapter.getSelectors(state => selectAdvertisementsData(state) ?? initialState)

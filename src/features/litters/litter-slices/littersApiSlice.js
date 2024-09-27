import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const littersAdapter = createEntityAdapter({})

const initialState = littersAdapter.getInitialState()

export const littersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLitters: builder.query({
            query: ({
                bornEarliest,
                bornLatest,
                breed,
                country,
                region,
                lowestPuppies,
                highestPuppies,
                currentPage
            }) => ({
                url: '/litters',
                params: {
                    bornEarliest,
                    bornLatest,
                    breed,
                    country,
                    region,
                    lowestPuppies,
                    highestPuppies,
                    page: currentPage
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const { litters, totalPages, currentPage } = responseData;
                const loadedLitters = litters.map(litter => {
                    litter.id = litter._id
                    return litter
                })
                
                return {
                    litters: littersAdapter.setAll(initialState, loadedLitters),
                    totalPages,
                    currentPage
                }
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Litter', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Litter', id }))
                    ]
                } else return [{ type: 'Litter', id: 'LIST' }]
            }
        }),
        getDogLitters: builder.query({
            query: ({ id }) => ({
                url: `/litters/dog/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedLitters = responseData.map(litter => {
                    litter.id = litter._id
                    return litter
                })
                return littersAdapter.setAll(initialState, loadedLitters)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Litter', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Litter', id }))
                    ]
                } else return [{ type: 'Litter', id: 'LIST' }]
            }
        }),
        getLitterById: builder.query({
            query: ({ id }) => ({
                url: `/litters/${id}`,
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
        addNewLitter: builder.mutation({
            query: initialLitter => ({
                url: '/litters',
                method: 'POST',
                body: {
                    ...initialLitter,
                }
            }),
            invalidatesTags: [
                { type: 'Litter', id: "LIST" }
            ]
        }),
        updateLitter: builder.mutation({
            query: initialLitter => ({
                url: '/litters',
                method: 'PATCH',
                body: {
                    ...initialLitter,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Litter', id: arg.id }
            ]
        }),
        deleteLitter: builder.mutation({
            query: ({ id }) => ({
                url: '/litters',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Litter', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetLittersQuery,
    useGetDogLittersQuery,
    useGetLitterByIdQuery,
    useAddNewLitterMutation,
    useUpdateLitterMutation,
    useDeleteLitterMutation,
} = littersApiSlice

export const selectLittersResult = littersApiSlice.endpoints.getLitters.select()

const selectLittersData = createSelector(
    selectLittersResult,
    littersResult => littersResult.data
)

export const {
    selectAll: selectAllLitters,
    selectById: selectLitterById,
    selectIds: selectLitterIds
} = littersAdapter.getSelectors(state => selectLittersData(state) ?? initialState)

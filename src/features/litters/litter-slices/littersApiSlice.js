import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const littersAdapter = createEntityAdapter({})

const initialState = littersAdapter.getInitialState()

export const littersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLitters: builder.query({
            query: () => ({
                url: '/litters',
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

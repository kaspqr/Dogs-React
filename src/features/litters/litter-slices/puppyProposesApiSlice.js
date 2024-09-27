import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const puppyProposesAdapter = createEntityAdapter({})

const initialState = puppyProposesAdapter.getInitialState()

export const puppyProposesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPuppyProposes: builder.query({
            query: ({ id }) => ({
                url: `/puppyproposes/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedPuppyProposes = responseData.map(puppyPropose => {
                    puppyPropose.id = puppyPropose._id
                    return puppyPropose
                })
                return puppyProposesAdapter.setAll(initialState, loadedPuppyProposes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'PuppyPropose', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'PuppyPropose', id }))
                    ]
                } else return [{ type: 'PuppyPropose', id: 'LIST' }]
            }
        }),
        getUserPuppyProposes: builder.query({
            query: ({ id }) => ({
                url: `/puppyproposes/user/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedPuppyProposes = responseData.map(puppyPropose => {
                    puppyPropose.id = puppyPropose._id
                    return puppyPropose
                })
                return puppyProposesAdapter.setAll(initialState, loadedPuppyProposes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'PuppyPropose', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'PuppyPropose', id }))
                    ]
                } else return [{ type: 'PuppyPropose', id: 'LIST' }]
            }
        }),
        addNewPuppyPropose: builder.mutation({
            query: initialPuppyPropose => ({
                url: '/puppyproposes',
                method: 'POST',
                body: {
                    ...initialPuppyPropose,
                }
            }),
            invalidatesTags: [
                { type: 'PuppyPropose', id: "LIST" }
            ]
        }),
        deletePuppyPropose: builder.mutation({
            query: ({ id }) => ({
                url: '/puppyproposes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'PuppyPropose', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetPuppyProposesQuery,
    useGetUserPuppyProposesQuery,
    useAddNewPuppyProposeMutation,
    useDeletePuppyProposeMutation,
} = puppyProposesApiSlice

export const selectPuppyProposesResult = puppyProposesApiSlice.endpoints.getPuppyProposes.select()

const selectPuppyProposesData = createSelector(
    selectPuppyProposesResult,
    puppyProposesResult => puppyProposesResult.data
)

export const {
    selectAll: selectAllPuppyProposes,
    selectById: selectPuppyProposeById,
    selectIds: selectPuppyProposeIds
} = puppyProposesAdapter.getSelectors(state => selectPuppyProposesData(state) ?? initialState)

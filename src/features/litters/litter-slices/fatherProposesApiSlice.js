import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const fatherProposesAdapter = createEntityAdapter({})

const initialState = fatherProposesAdapter.getInitialState()

export const fatherProposesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFatherProposes: builder.query({
            query: ({ id }) => ({
                url: `/fatherproposes/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedFatherProposes = responseData.map(fatherPropose => {
                    fatherPropose.id = fatherPropose._id
                    return fatherPropose
                })
                return fatherProposesAdapter.setAll(initialState, loadedFatherProposes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'FatherPropose', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'FatherPropose', id }))
                    ]
                } else return [{ type: 'FatherPropose', id: 'LIST' }]
            }
        }),
        addNewFatherPropose: builder.mutation({
            query: initialFatherPropose => ({
                url: '/fatherproposes',
                method: 'POST',
                body: {
                    ...initialFatherPropose,
                }
            }),
            invalidatesTags: [
                { type: 'FatherPropose', id: "LIST" }
            ]
        }),
        deleteFatherPropose: builder.mutation({
            query: ({ id }) => ({
                url: '/fatherproposes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'FatherPropose', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetFatherProposesQuery,
    useAddNewFatherProposeMutation,
    useDeleteFatherProposeMutation,
} = fatherProposesApiSlice

export const selectFatherProposesResult = fatherProposesApiSlice.endpoints.getFatherProposes.select()

const selectFatherProposesData = createSelector(
    selectFatherProposesResult,
    fatherProposesResult => fatherProposesResult.data
)

export const {
    selectAll: selectAllFatherProposes,
    selectById: selectFatherProposeById,
    selectIds: selectFatherProposeIds
} = fatherProposesAdapter.getSelectors(state => selectFatherProposesData(state) ?? initialState)

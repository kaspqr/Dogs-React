import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const dogProposesAdapter = createEntityAdapter({})

const initialState = dogProposesAdapter.getInitialState()

export const dogProposesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDogProposes: builder.query({
            query: () => ({
                url: '/dogproposes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedDogProposes = responseData.map(dogPropose => {
                    dogPropose.id = dogPropose._id
                    return dogPropose
                })
                return dogProposesAdapter.setAll(initialState, loadedDogProposes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'DogPropose', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'DogPropose', id }))
                    ]
                } else return [{ type: 'DogPropose', id: 'LIST' }]
            }
        }),
        addNewDogPropose: builder.mutation({
            query: initialDogPropose => ({
                url: '/dogproposes',
                method: 'POST',
                body: {
                    ...initialDogPropose,
                }
            }),
            invalidatesTags: [
                { type: 'DogPropose', id: "LIST" }
            ]
        }),
        deleteDogPropose: builder.mutation({
            query: ({ id }) => ({
                url: '/dogproposes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'DogPropose', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetDogProposesQuery,
    useAddNewDogProposeMutation,
    useDeleteDogProposeMutation,
} = dogProposesApiSlice

export const selectDogProposesResult = dogProposesApiSlice.endpoints.getDogProposes.select()

const selectDogProposesData = createSelector(
    selectDogProposesResult,
    dogProposesResult => dogProposesResult.data
)

export const {
    selectAll: selectAllDogProposes,
    selectById: selectDogProposeById,
    selectIds: selectDogProposeIds
} = dogProposesAdapter.getSelectors(state => selectDogProposesData(state) ?? initialState)

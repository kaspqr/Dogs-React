import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const resetTokensAdapter = createEntityAdapter({})

const initialState = resetTokensAdapter.getInitialState()

export const resetTokensApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getResetTokens: builder.query({
            query: () => ({
                url: '/resettokens',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedResetTokens = responseData.map(resetToken => {
                    resetToken.id = resetToken._id
                    return resetToken
                })
                return resetTokensAdapter.setAll(initialState, loadedResetTokens)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'ResetToken', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'ResetToken', id }))
                    ]
                } else return [{ type: 'ResetToken', id: 'LIST' }]
            }
        }),
        addNewResetToken: builder.mutation({
            query: initialResetToken => ({
                url: '/resettokens',
                method: 'POST',
                body: {
                    ...initialResetToken,
                }
            }),
            invalidatesTags: [
                { type: 'ResetToken', id: "LIST" }
            ]
        }),
    })
})

export const {
    useGetResetTokensQuery,
    useAddNewResetTokenMutation,
} = resetTokensApiSlice

export const selectResetTokensResult = resetTokensApiSlice.endpoints.getResetTokens.select()

const selectResetTokensData = createSelector(
    selectResetTokensResult,
    resetTokensResult => resetTokensResult.data
)

export const {
    selectAll: selectAllResetTokens,
    selectById: selectResetTokenById,
    selectIds: selectResetTokenIds
} = resetTokensAdapter.getSelectors(state => selectResetTokensData(state) ?? initialState)

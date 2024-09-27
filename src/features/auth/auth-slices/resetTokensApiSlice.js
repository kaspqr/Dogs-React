import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const resetTokensAdapter = createEntityAdapter({})

const initialState = resetTokensAdapter.getInitialState()

export const resetTokensApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getResetToken: builder.query({
            query: ({ resetToken, user }) => ({
                url: `/resettokens/${resetToken}/${user}`,
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
    useGetResetTokenQuery,
    useAddNewResetTokenMutation,
} = resetTokensApiSlice

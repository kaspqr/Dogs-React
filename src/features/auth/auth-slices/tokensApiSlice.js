import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const tokensAdapter = createEntityAdapter({})

const initialState = tokensAdapter.getInitialState()

export const tokensApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getToken: builder.query({
            query: ({ token, user }) => ({
                url: `/tokens/${token}/${user}`,
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
        })
    })
})

export const {
    useGetTokenQuery,
} = tokensApiSlice

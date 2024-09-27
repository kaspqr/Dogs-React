import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const emailTokensAdapter = createEntityAdapter({})

const initialState = emailTokensAdapter.getInitialState()

export const emailTokensApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getEmailToken: builder.query({
      query: ({ emailToken, user }) => ({
        url: `/emailtokens/${emailToken}/${user}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        },
      }),
      transformResponse: responseData => {
        const loadedEmailTokens = responseData.map(emailToken => {
          emailToken.id = emailToken._id
          return emailToken
        })
        return emailTokensAdapter.setAll(initialState, loadedEmailTokens)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'EmailToken', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'EmailToken', id }))
          ]
        } else return [{ type: 'EmailToken', id: 'LIST' }]
      }
    }),
  })
})

export const {
  useGetEmailTokenQuery,
} = emailTokensApiSlice

import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../../app/api/apiSlice"

const emailTokensAdapter = createEntityAdapter({})

const initialState = emailTokensAdapter.getInitialState()

export const emailTokensApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getEmailTokens: builder.query({
      query: () => ({
        url: '/emailtokens',
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
  useGetEmailTokensQuery,
} = emailTokensApiSlice

export const selectEmailTokensResult = emailTokensApiSlice.endpoints.getEmailTokens.select()

const selectEmailTokensData = createSelector(
  selectEmailTokensResult,
  emailTokensResult => emailTokensResult.data
)

export const {
  selectAll: selectAllEmailTokens,
  selectById: selectEmailTokenById,
  selectIds: selectEmailTokenIds
} = emailTokensAdapter.getSelectors(state => selectEmailTokensData(state) ?? initialState)

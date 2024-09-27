import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const conversationsAdapter = createEntityAdapter({})

const initialState = conversationsAdapter.getInitialState()

export const conversationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getConversations: builder.query({
            query: ({ id }) => ({
                url: `/conversations/user/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedConversations = responseData.map(conversation => {
                    conversation.id = conversation._id
                    return conversation
                })
                return conversationsAdapter.setAll(initialState, loadedConversations)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Conversation', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Conversation', id }))
                    ]
                } else return [{ type: 'Conversation', id: 'LIST' }]
            }
        }),
        getConversationById: builder.query({
            query: ({ id }) => ({
                url: `/conversations/${id}`,
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
        addNewConversation: builder.mutation({
            query: initialConversation => ({
                url: '/conversations',
                method: 'POST',
                body: {
                    ...initialConversation,
                }
            }),
            invalidatesTags: [
                { type: 'Conversation', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetConversationsQuery,
    useGetConversationByIdQuery,
    useAddNewConversationMutation,
} = conversationsApiSlice

export const selectConversationsResult = conversationsApiSlice.endpoints.getConversations.select()

const selectConversationsData = createSelector(
    selectConversationsResult,
    conversationsResult => conversationsResult.data
)

export const {
    selectAll: selectAllConversations,
    selectById: selectConversationById,
    selectIds: selectConversationIds
} = conversationsAdapter.getSelectors(state => selectConversationsData(state) ?? initialState)

import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const messagesAdapter = createEntityAdapter({})

const initialState = messagesAdapter.getInitialState()

export const messagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMessages: builder.query({
            query: ({ id }) => ({
                url: `/messages/conversation/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedMessages = responseData.map(message => {
                    message.id = message._id
                    return message
                })
                return messagesAdapter.setAll(initialState, loadedMessages)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Message', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Message', id }))
                    ]
                } else return [{ type: 'Message', id: 'LIST' }]
            }
        }),
        getMessageById: builder.query({
            query: ({ id }) => ({
                url: `/messages/${id}`,
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
        addNewMessage: builder.mutation({
            query: initialMessage => ({
                url: '/messages',
                method: 'POST',
                body: {
                    ...initialMessage,
                }
            }),
            invalidatesTags: [
                { type: 'Message', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetMessagesQuery,
    useGetMessageByIdQuery,
    useAddNewMessageMutation,
} = messagesApiSlice

export const selectMessagesResult = messagesApiSlice.endpoints.getMessages.select()

const selectMessagesData = createSelector(
    selectMessagesResult,
    messagesResult => messagesResult.data
)

export const {
    selectAll: selectAllMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds
} = messagesAdapter.getSelectors(state => selectMessagesData(state) ?? initialState)

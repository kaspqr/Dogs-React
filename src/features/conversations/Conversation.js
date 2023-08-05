import { Link } from "react-router-dom"
import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetMessagesQuery } from "../messages/messagesApiSlice"
import { memo } from "react"
import useAuth from "../../hooks/useAuth"

const Conversation = ({ conversationId }) => {

    const { userId } = useAuth()

    // GET the conversation with all of it's .values
    const { conversation } = useGetConversationsQuery("conversationsList", {
        selectFromResult: ({ data }) => ({
            conversation: data?.entities[conversationId]
        }),
    })

    // GET the user who is the receiver of said conversation
    const { receiver } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            receiver: data?.entities[conversation?.receiver]
        }),
    })

    // GET the user who is the sender of said conversation
    const { sender } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            sender: data?.entities[conversation?.sender]
        }),
    })

    // GET all the messages
    const {
        data: messages,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetMessagesQuery('messagesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    if (isLoading) return <p>Loading...</p>

    if (isError) return <p>Error: {error}</p>

    if (!conversation) {
        return null
    }

    if (!receiver) {
        return null
    }

    if (!sender) {
        return null
    }

    if (isSuccess) {
        const { entities } = messages

        // Get the messages of current conversation
        const currentConversationMessages = Object.values(entities)?.filter(message => {
            return message.conversation === conversationId
        })

        // Get the last message in the conversation
        const lastMessage = currentConversationMessages?.length 
            ? currentConversationMessages[currentConversationMessages.length - 1] 
            : null

        // Variable for the other user who you're having a conversation with
        let otherUser

        if (receiver?.id === userId) {
            otherUser = sender
        }

        if (sender?.id === userId) {
            otherUser = receiver
        }


        return (
            <tr>
                <td><Link className="orange-link" to={`/conversations/${conversation.id}`}><b>{otherUser.username}</b></Link></td>
                <td>{lastMessage?.sender ? 
                    lastMessage?.text?.length > 20 
                        ? `${lastMessage?.text?.slice(0, 20)}...` 
                        : `${lastMessage?.text}`
                    : null
                }</td>
            </tr>
        )
    }
}

const memoizedConversation = memo(Conversation)

export default memoizedConversation

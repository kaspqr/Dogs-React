import { Link } from "react-router-dom"
import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const Conversation = ({ conversationId }) => {

    const { conversation } = useGetConversationsQuery("conversationsList", {
        selectFromResult: ({ data }) => ({
            conversation: data?.entities[conversationId]
        }),
    })

    const { receiver } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            receiver: data?.entities[conversation?.receiver]
        }),
    })

    const { sender } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            sender: data?.entities[conversation?.sender]
        }),
    })

    if (!conversation) {
        return null
    }

    if (!receiver && !sender) {
        return null
    }

    if (receiver?.length && sender?.length) {
        return null
    }

    let otherUser

    if (receiver?.length && !sender.length) {
        otherUser = receiver
    }

    if (sender?.length && !receiver.length) {
        otherUser = sender
    }


    return (
        <tr>
            <td><Link to={`/users/${otherUser.id}`}>{otherUser.username}</Link></td>
            <td>{otherUser.id}</td>
        </tr>
    )
}

const memoizedConversation = memo(Conversation)

export default memoizedConversation

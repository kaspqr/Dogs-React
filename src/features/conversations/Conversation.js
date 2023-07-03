import { Link } from "react-router-dom"
import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"
import useAuth from "../../hooks/useAuth"

const Conversation = ({ conversationId }) => {

    const { userId } = useAuth()

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
        console.log('no convo')
        return null
    }

    if (!receiver) {
        console.log('no receiver')
        return null
    }

    if (!sender) {
        console.log('no sender')
        return null
    }

    let otherUser

    if (receiver?.id === userId) {
        console.log('other user is sender')
        otherUser = sender
    }

    if (sender?.id === userId) {
        console.log('other user is receiver')
        otherUser = receiver
    }

    console.log(sender)
    console.log(receiver)
    console.log(otherUser)


    return (
        <tr>
            <td><Link className="orange-link" to={`/users/${otherUser.id}`}><b>{otherUser.username}</b></Link></td>
            <td><Link className="orange-link" to={`/conversations/${conversation.id}`}><b>Open</b></Link></td>
        </tr>
    )
}

const memoizedConversation = memo(Conversation)

export default memoizedConversation

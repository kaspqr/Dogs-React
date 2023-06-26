import { useGetMessagesQuery } from "./messagesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"
import useAuth from "../../hooks/useAuth"

const Message = ({ messageId }) => {

    const { userId } = useAuth()

    const { message } = useGetMessagesQuery("messagesList", {
        selectFromResult: ({ data }) => ({
            message: data?.entities[messageId]
        }),
    })

    const { sender } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            sender: data?.entities[message?.sender]
        }),
    })

    if (!message || !sender) {
        return null
    }

    let isSender

    if (message?.sender?.length && message.sender === userId) {
        isSender = true
    }

    if (message?.sender?.length && message.sender !== userId) {
        isSender = false
    }


    return (
        <tr>
            <td>{message.sender}</td>
            <td>{message.text}</td>
            <td>{message.time}</td>
        </tr>
    )
}

const memoizedMessage = memo(Message)

export default memoizedMessage

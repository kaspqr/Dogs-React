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

    const messageStyle = message.sender === userId ? {backgroundColor: "rgb(235, 155, 52)", float: "right"} : {backgroundColor: "lightgrey", float: "left"}
    const timeStyle = message.sender === userId ? {float: "right"} : {float: "left"}

    return (
        <>
            <p style={timeStyle} className="message-time">{message.time}</p>
            <br />
            <p style={messageStyle} className="message-text">{message.text}</p>
            <br />
            <br />
        </>
    )
}

const memoizedMessage = memo(Message)

export default memoizedMessage

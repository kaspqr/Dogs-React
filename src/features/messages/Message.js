import { useGetMessagesQuery } from "./messagesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"
import useAuth from "../../hooks/useAuth"

const Message = ({ messageId }) => {

    const { userId } = useAuth()

    // GET the message with all of it's .values
    const { message } = useGetMessagesQuery("messagesList", {
        selectFromResult: ({ data }) => ({
            message: data?.entities[messageId]
        }),
    })

    // GET the user who is the sender of THE message with all of it's .values
    const { sender } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            sender: data?.entities[message?.sender]
        }),
    })

    if (!message || !sender) {
        return null
    }

    // Different style for messages sent by the logged in user
    const messageStyle = message.sender === userId ? {backgroundColor: "rgb(235, 155, 52)", float: "right"} : {backgroundColor: "lightgrey", float: "left"}
    const timeStyle = message.sender === userId ? {float: "right"} : {float: "left"}

    return (
        <>
            <p style={timeStyle} className="message-time">{message.time.split('T').join(' ').split('Z').join(' ').split(':').slice(0, 2).join(':')}</p>
            <br />
            <p style={messageStyle} className="message-text">{message.text}</p>
            <br />
            <br />
        </>
    )
}

const memoizedMessage = memo(Message)

export default memoizedMessage

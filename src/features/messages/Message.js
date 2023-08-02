import { useGetMessagesQuery } from "./messagesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"
import useAuth from "../../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const Message = ({ messageId }) => {

    const navigate = useNavigate()

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
    const messageStyle = message?.sender === userId ? {backgroundColor: "rgb(235, 155, 52)", float: "right"} : {backgroundColor: "lightgrey", float: "left"}
    const timeStyle = message?.sender === userId ? {float: "right"} : {float: "left", display: "none"}

    const timeId = `time-${message?.id}`
    const msgId = `message-${message?.id}`

    const handleMessageClicked = (e) => {
        const extraInfoParagraphId = 'time-' + e.target.id.split('-')[1]
        const extraInfoParagraph = document.getElementById(extraInfoParagraphId)
        if (extraInfoParagraph.style.display === 'none') {
            extraInfoParagraph.style.display = 'block'
        } else {
            extraInfoParagraph.style.display = 'none'
        }
    }

    return (
        <>
            <p id={timeId} style={timeStyle} className="message-time">
                {message?.sender !== userId
                    ? <button
                        onClick={() => navigate(`/reportmessage/${message?.id}`)}
                        className="report-message-button"
                    >
                        <FontAwesomeIcon color="red" icon={faTriangleExclamation} />
                    </button>
                    : null
                }
                {message.time.split('T').join(' ').split('Z').join(' ').split(':').slice(0, 2).join(':')}
            </p>
            <br />
            <p 
                id={msgId}
                style={messageStyle} 
                className="message-text"
                onClick={handleMessageClicked}
            >
                {message?.text}
            </p>
            <br />
            <br />
        </>
    )
}

const memoizedMessage = memo(Message)

export default memoizedMessage

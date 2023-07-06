import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetMessagesQuery, useAddNewMessageMutation } from "../messages/messagesApiSlice"
import Message from "../messages/Message"
import { useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect, useRef } from "react"

const ConversationPage = () => {

    const { userId } = useAuth()

    const { conversationid } = useParams()

    const [newMessage, setNewMessage] = useState()

    // POST method for a new message
    const [addNewMessage, {
        isLoading: isMessageLoading,
        isSuccess: isMessageSuccess,
        isError: isMessageError,
        error: messageError
    }] = useAddNewMessageMutation()

    async function handleSendMessage(e) {
        e.preventDefault()
        if (newMessage?.length) {
            // POST the new message
            await addNewMessage({ sender: userId, conversation: conversationid, text: newMessage })
            setNewMessage('')
        }
    }

    // GET the conversation with all of it's .values
    const { conversation } = useGetConversationsQuery("conversationsList", {
        selectFromResult: ({ data }) => ({
            conversation: data?.entities[conversationid]
        }),
    })

    // GET the user who is the sender of said conversation with all of it's .values
    const { sender } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            sender: data?.entities[conversation?.sender]
        }),
    })

    // GET the user who is the receiver of said conversation with all of it's .values
    const { receiver } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            receiver: data?.entities[conversation?.receiver]
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

    const conversationDivRef = useRef(null)

    useEffect(() => {
        // Scroll the conversation div to the bottom after component renders
        if (conversationDivRef.current) {
            conversationDivRef.current.scrollTop = conversationDivRef.current.scrollHeight
        }
    })

    // Clear the input if the previous message has been successfully sent
    useEffect(() => {
        if (isMessageSuccess) {
            setNewMessage('')
        }
    }, [isMessageSuccess])
    
    // Variable for errors and content
    let messageContent
    
    if (isLoading) messageContent = <p>Loading...</p>
    
    if (isError) {
        messageContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids, entities } = messages

        // Variable to store all messages in this conversation
        let filteredMessages

        // Filter all the IDs of all the messages in this conversation
        const filteredIds = ids.filter(messageId => entities[messageId].conversation === conversation?.id)

        if (filteredIds?.length) {
            filteredMessages = filteredIds.map(messageId => entities[messageId])
        }

        // Variable to store all Message components for each message in the conversation
        let tableContent

        if (filteredMessages?.length) {
            tableContent = filteredMessages.map(message => (
               <Message key={message.id} messageId={message.id} />
            ))
        }
      
        messageContent = (
            <>
                <div ref={conversationDivRef} className="conversation-page-messages-div">{tableContent}</div>
                <div className="conversation-page-message-input-div">
                    <form onSubmit={(e) => handleSendMessage(e)}>
                        <label htmlFor="new-message"><b>New Message:</b></label>
                        <br />
                        <input 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)} 
                            name="new-message" 
                            id="new-message" 
                        />
                        <button
                            className="send-message-button black-button"
                            disabled={!newMessage?.length}
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </>
        )
    }

    if (!conversation || !sender || !receiver) {
        return null
    }

    // Check that the logged in user is a participant of said conversation
    if (userId !== conversation?.sender && userId !== conversation?.receiver) {
        return null
    }

    return (
        <>
            {sender.id === userId ? <p className="conversation-page-username-title">{receiver.username}</p> : <p className="conversation-page-username-title">{sender.username}</p>}
            <br />
            {isSuccess && messageContent}
        </>
    )
}

export default ConversationPage

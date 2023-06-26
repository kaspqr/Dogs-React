import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetMessagesQuery } from "../messages/messagesApiSlice"
import Message from "../messages/Message"
import { useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const ConversationPage = () => {

    const { userId } = useAuth()

    const { conversationid } = useParams()

    const { conversation } = useGetConversationsQuery("conversationsList", {
        selectFromResult: ({ data }) => ({
            conversation: data?.entities[conversationid]
        }),
    })

    const { sender } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            sender: data?.entities[conversation?.sender]
        }),
    })

    const { receiver } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            receiver: data?.entities[conversation?.receiver]
        }),
    })

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
    
    let messageContent
    let optionsContent
    
    if (isLoading) messageContent = <p>Loading...</p>
    
    if (isError) {
        messageContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids, entities } = messages

        let filteredMessages

        const filteredIds = ids.filter(messageId => entities[messageId].conversation === conversation.id)

        if (filteredIds?.length) {
            filteredMessages = filteredIds.map(messageId => entities[messageId])
        }

        let tableContent

        if (filteredMessages?.length) {
            tableContent = filteredMessages.map(message => (
               <Message key={message.id} messageId={message.id} />
            ))
        }

        console.log(ids)
        console.log(filteredIds)
        console.log(tableContent)
      
        messageContent = (
            <table>
                <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Text</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    if (!conversation || !sender || !receiver) {
        return null
    }

    if (userId !== conversation?.sender || userId !== conversation?.receiver) {
        return null
    }

    return (
        <>
            <p>Sender: {conversation?.sender}</p>
            <p>Receiver: {conversation?.receiver}</p>
            {messageContent}
        </>
    )
}

export default ConversationPage

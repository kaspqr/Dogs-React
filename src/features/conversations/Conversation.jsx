import { memo } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/user-slices/usersApiSlice"
import { useGetMessagesQuery } from "../messages/messagesApiSlice"
import useAuth from "../../hooks/useAuth"
import { alerts } from "../../components/alerts"

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

  const {
    data: messages,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMessagesQuery('messagesList', {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  if (isLoading) alerts.loadingAlert("Looking for messages")
  if (isError) alerts.errorAlert(error?.data?.message)

  if (!conversation || !receiver || !sender) return

  if (isSuccess) {
    Swal.close()

    const { entities } = messages

    const currentConversationMessages = Object.values(entities)?.filter(message => {
      return message.conversation === conversationId
    })

    const lastMessage = currentConversationMessages?.length
      ? currentConversationMessages[currentConversationMessages.length - 1]
      : null

    const otherUser = receiver?.id === userId ? sender : receiver

    return (
      <Link className="conversation-link" to={`/conversations/${conversation.id}`}>
        <div className="conversation-div">
          <span><b>{otherUser.username}</b></span>
          <span className="conversation-message-span">
            {lastMessage?.sender ?
              lastMessage?.text?.length > 12
                ? `${lastMessage?.text?.slice(0, 12)}...`
                : `${lastMessage?.text}`
              : null
            }
          </span>
        </div>
      </Link>
    )
  }

  return
}

const memoizedConversation = memo(Conversation)

export default memoizedConversation

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import Swal from "sweetalert2"

import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetUsersQuery } from "../users/user-slices/usersApiSlice"
import { useGetMessagesQuery, useAddNewMessageMutation } from "../messages/messagesApiSlice"
import Message from "../messages/Message"
import useAuth from "../../hooks/useAuth"
import { alerts } from "../../components/alerts"

const ConversationPage = () => {
  const { userId } = useAuth()
  const { conversationid } = useParams()
  const conversationDivRef = useRef(null)

  const [newMessage, setNewMessage] = useState('')
  const [displayedMessagesCount, setDisplayedMessagesCount] = useState(30)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false)

  const [addNewMessage, {
    isSuccess: isMessageSuccess,
    isError: isMessageError,
    error: messageError
  }] = useAddNewMessageMutation()

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

  const handleScroll = useCallback(() => {
    if (conversationDivRef?.current.scrollTop === 0 && hasMoreMessages) {
      const previousScrollHeight = conversationDivRef?.current.scrollHeight
      const previousScrollTop = conversationDivRef?.current.scrollTop

      setDisplayedMessagesCount(prevCount => prevCount + 30)

      setTimeout(() => {
        requestAnimationFrame(() => {
          const newScrollHeight = conversationDivRef?.current.scrollHeight
          const scrollPositionChange = newScrollHeight - previousScrollHeight
          conversationDivRef.current.scrollTop = previousScrollTop + scrollPositionChange
        })
      }, 0)
    }
  }, [hasMoreMessages])

  const filteredIds = messages?.ids?.filter(messageId => (
    messages?.entities[messageId].conversation === conversation?.id
  ))

  const filteredMessagesLength = filteredIds.length
  const otherUser = sender.id === userId ? receiver : sender

  useEffect(() => {
    if (conversationDivRef?.current && initialMessagesLoaded === false) {
      conversationDivRef.current.scrollTop = conversationDivRef.current.scrollHeight
      setInitialMessagesLoaded(true)
    }
  }, [messages, initialMessagesLoaded])

  useEffect(() => {
    if (isMessageSuccess) setNewMessage('')
  }, [isMessageSuccess])

  useEffect(() => {
    const divRef = conversationDivRef?.current

    divRef?.addEventListener('scroll', handleScroll)

    return () => {
      divRef?.removeEventListener('scroll', handleScroll)
    }
  }, [hasMoreMessages, handleScroll])

  useEffect(() => {
    if (filteredMessagesLength) {
      setHasMoreMessages(displayedMessagesCount < filteredMessagesLength)
    }
  }, [displayedMessagesCount, filteredMessagesLength])

  useEffect(() => {
    setDisplayedMessagesCount(prevCount => prevCount + 1)
  }, [messages?.ids.length])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (newMessage?.trim().length) {
      await addNewMessage({ sender: userId, conversation: conversationid, text: newMessage })
    }
  }

  if (!conversation || !sender || !receiver) return
  if (userId !== conversation?.sender && userId !== conversation?.receiver) return

  if (isLoading) alerts.loadingAlert("Looking for messages")
  if (isError) alerts.errorAlert(error?.data?.message)
  if (isMessageError) alerts.errorAlert(messageError?.data?.message)

  if (isSuccess) {
    Swal.close()

    const { entities } = messages

    const filteredMessagesEntities = filteredIds?.length
      ? filteredIds.map(messageId => entities[messageId])
      : null

    const tableContent = filteredMessagesEntities?.length
      ? filteredMessagesEntities.slice(-displayedMessagesCount).map(message => (
        <Message key={message.id} messageId={message.id} />
      ))
      : null

    return (
      <>
        <p className="conversation-page-username-title">
          <Link
            className="grey-link"
            to={`/users/${otherUser.id}`}
          >
            {otherUser.username}
          </Link>
        </p>
        <br />
        <div ref={conversationDivRef} className="conversation-page-messages-div">
          {tableContent}
        </div>
        <div className="conversation-page-message-input-div">
          <form onSubmit={(e) => handleSendMessage(e)}>
            <label className="off-screen" htmlFor="new-message">
              <b>New Message</b>
            </label>
            <br />
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              name="new-message"
              id="new-message"
            />
            <button
              title="Send Message"
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

  return
}

export default ConversationPage

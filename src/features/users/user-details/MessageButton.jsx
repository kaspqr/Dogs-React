import React, { useEffect } from 'react'
import { alerts } from '../../../components/alerts';
import { useAddNewConversationMutation, useGetConversationsQuery } from '../../conversations/conversationsApiSlice';
import { useNavigate } from 'react-router-dom';

const MessageButton = ({ userId, id }) => {
  const navigate = useNavigate()
  
  const [addNewConversation, { isLoading, isError, error }] = useAddNewConversationMutation();

  const {
    data: conversations,
    isLoading: isConversationsLoading,
    isSuccess: isConversationsSuccess,
    isError: isConversationsError,
    error: conversationsError,
  } = useGetConversationsQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isConversationsError) alerts.errorAlert(`${conversationsError?.data?.message}`);
  }, [isConversationsError])

  if (isLoading || isConversationsLoading) return

  if (isConversationsSuccess) {
    const { ids, entities } = conversations

    const usersConversationInArray = ids?.filter((conversationId) => (
      (entities[conversationId].sender === id && entities[conversationId].receiver === userId) ||
      (entities[conversationId].receiver === id && entities[conversationId].sender === userId)
    ))

    return (
      <button
        title="Message User"
        className="user-page-edit-button black-button"
        onClick={async () => {
          if (usersConversationInArray?.length) navigate(`/conversations/${usersConversationInArray[0]}`);
          else {
            const response = await addNewConversation({ sender: userId, receiver: id });
            if (response) navigate(`/conversations/${response?.data?.newConversationId}`);
          }
        }}
      >
        Message
      </button>
    )
  }

  return
}

export default MessageButton

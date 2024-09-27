import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetConversationByIdQuery } from "./conversationsApiSlice";
import { useGetMessagesQuery, useAddNewMessageMutation } from "../messages/messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";
import MessagesList from "../messages/MessagesList";
import OtherUserLink from "./OtherUserLink";

const ConversationPage = () => {
  const { userId } = useAuth();
  const { conversationid } = useParams();

  const [newMessage, setNewMessage] = useState("");

  const {
    data: conversation,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetConversationByIdQuery({ id: conversationid }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  const {
    data: messages,
    isLoading: isMessagesLoading,
    isSuccess: isMessagesSuccess,
    isError: isMessagesError,
    error: messagesError,
  } = useGetMessagesQuery({ id: conversationid }, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewMessage, {
    isSuccess: isMessageSuccess,
    isError: isMessageError,
    error: messageError,
  }] = useAddNewMessageMutation();

  useEffect(() => {
    if (isMessageSuccess) setNewMessage("");
  }, [isMessageSuccess]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  useEffect(() => {
    if (isMessageError) alerts.errorAlert(`${messageError?.data?.message}`)
  }, [isMessageError])

  useEffect(() => {
    if (isMessagesError) alerts.errorAlert(`${messagesError?.data?.message}aaa`)
  }, [isMessagesError])

  if (!conversation || isLoading || isMessagesLoading) return;
  if (userId !== conversation?.sender && userId !== conversation?.receiver) return;

  if (isSuccess && isMessagesSuccess) {
    const otherUserId = conversation?.sender === userId ? conversation?.receiver : conversation?.sender;

    return (
      <>
        <p className="conversation-page-username-title">
          <OtherUserLink id={otherUserId} />
        </p>
        <br />
        <MessagesList messages={messages} />
        <div className="conversation-page-message-input-div">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (newMessage?.trim().length) {
                await addNewMessage({
                  sender: userId,
                  conversation: conversationid,
                  text: newMessage,
                });
              }
            }}
          >
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
    );
  }

  return;
};

export default ConversationPage;

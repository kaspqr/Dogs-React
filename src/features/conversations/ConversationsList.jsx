import { useEffect } from "react";
import Swal from "sweetalert2";

import { useGetConversationsQuery } from "./conversationsApiSlice";
import { useGetMessagesQuery } from "../messages/messagesApiSlice";
import Conversation from "./Conversation";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";

const ConversationsList = () => {
  const { userId } = useAuth();

  const {
    data: conversations,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetConversationsQuery("conversationsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: messages,
    isLoading: isMsgLoading,
    isSuccess: isMsgSuccess,
    isError: isMsgError,
    error: msgError,
  } = useGetMessagesQuery("messagesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading || isMsgLoading)
      alerts.loadingAlert("Fetching Conversations", "Loading...");
    else Swal.close();
  }, [isLoading, isMsgLoading]);

  if (isError)
    alerts.errorAlert(
      `${error?.data?.message}`,
      "Error Fetching Conversations"
    );
  if (isMsgError)
    alerts.errorAlert(`${msgError?.data?.message}`, "Error Fetching Messages");

  if (isSuccess && isMsgSuccess) {
    const { ids, entities } = conversations;
    const { ids: msgIds, entities: msgEntities } = messages;

    const filteredIds = ids.filter(
      (conversationId) =>
        entities[conversationId].sender === userId ||
        entities[conversationId].receiver === userId
    );

    const lastMessages = filteredIds.map((convoId) => {
      const allMessages = msgIds.map((msgId) => msgEntities[msgId]);
      const conversationMessages = allMessages.filter(
        (message) => message.conversation === convoId
      );
      return conversationMessages[conversationMessages.length - 1];
    });

    const sortedLastMessages = lastMessages?.sort((a, b) => {
      return new Date(b.time) - new Date(a.time);
    });

    const tableContent = sortedLastMessages?.map((message) => {
      const conversationId = message.conversation;
      return (
        <Conversation key={conversationId} conversationId={conversationId} />
      );
    });

    const finalContent = !filteredIds?.length ? (
      <p>You have no messages</p>
    ) : (
      tableContent
    );

    return finalContent;
  }

  return;
};

export default ConversationsList;

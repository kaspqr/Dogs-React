import { useEffect } from "react";

import { useGetConversationsQuery } from "./conversationsApiSlice";
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
  } = useGetConversationsQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError]);

  if (isLoading) return

  if (isSuccess) {
    const { ids, entities } = conversations;

    if (!ids?.length) return <p>You have no messages</p>

    return ids?.map((id) => <Conversation key={id} conversation={entities[id]} userId={userId} />)
  }

  return;
};

export default ConversationsList;

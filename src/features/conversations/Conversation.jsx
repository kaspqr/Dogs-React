import { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { alerts } from "../../components/alerts";
import { useGetUserByIdQuery } from "../users/user-slices/usersApiSlice";

const Conversation = ({ conversation, userId }) => {
  const {
    data: otherUser,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: conversation?.sender === userId ? conversation?.receiver : conversation?.sender }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    return (
      <Link
        className="conversation-link"
        to={`/conversations/${conversation?.id}`}
      >
        <div className="conversation-div">
          <span>
            <b>{otherUser.username}</b>
          </span>
          <span className="conversation-message-span">
            {!conversation?.lastMessage?.sender ? null : conversation?.lastMessage?.text?.length > 12
              ? `${conversation?.lastMessage?.text?.slice(0, 12)}...`
              : `${conversation?.lastMessage?.text}`
            }
          </span>
        </div>
      </Link>
    );
  }

  return
}

const memoizedConversation = memo(Conversation);

export default memoizedConversation;

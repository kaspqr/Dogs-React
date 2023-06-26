import { useGetConversationsQuery } from "./conversationsApiSlice"
import Conversation from "./Conversation"

const ConversationsList = () => {

  const {
    data: conversations,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetConversationsQuery('conversationsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = conversations

    const tableContent = ids?.length
      ? ids.map(conversationId => <Conversation key={conversationId} conversationId={conversationId} />)
      : null

    content = (
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content
}

export default ConversationsList

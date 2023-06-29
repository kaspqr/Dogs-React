import { useGetConversationsQuery } from "./conversationsApiSlice"
import Conversation from "./Conversation"
import useAuth from "../../hooks/useAuth"

const ConversationsList = () => {

  const { userId } = useAuth()

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
    const { ids, entities } = conversations

    const filteredIds = ids.filter(conversationId => entities[conversationId].sender === userId || entities[conversationId].receiver === userId)

    let tableContent

    if (filteredIds?.length) {
      console.log('filtered conversations has a length')
      tableContent = filteredIds.map(conversationId => <Conversation key={conversationId} conversationId={conversationId} />)
      console.log(tableContent)
    } else {
      console.log('filtered convos has no length')
    }

    console.log(ids)
    console.log(filteredIds)

    content = (
      <>
        <table className="content-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>User ID</th>
              <th>Open Convo</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
      </>
    )
  }

  return content
}

export default ConversationsList
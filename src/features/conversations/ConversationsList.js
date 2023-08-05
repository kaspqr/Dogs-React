import { useGetConversationsQuery } from "./conversationsApiSlice"
import Conversation from "./Conversation"
import useAuth from "../../hooks/useAuth"

const ConversationsList = () => {

  const { userId } = useAuth()

  // GET all the conversations
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

  // Variable for displaying errors and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids, entities } = conversations

    // Filter all the IDs of conversations where the logged in user is a participant in
    const filteredIds = ids.filter(conversationId => entities[conversationId].sender === userId || entities[conversationId].receiver === userId)

    // Variable to store all Conversation components for each conversation the logged in user is a participant in
    let tableContent

    if (filteredIds?.length) {
      tableContent = filteredIds.map(conversationId => <Conversation key={conversationId} conversationId={conversationId} />)
    } else {
      console.log('filtered convos has no length')
    }

    content = !filteredIds?.length ? <p>You have no messages</p> : (
      <>
        <table className="content-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Last Message</th>
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

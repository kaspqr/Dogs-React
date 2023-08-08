import { useGetConversationsQuery } from "./conversationsApiSlice"
import { useGetMessagesQuery } from "../messages/messagesApiSlice"
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
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // GET all the messages
  const {
    data: messages,
    isLoading: isMsgLoading,
    isSuccess: isMsgSuccess,
    isError: isMsgError,
    error: msgError
  } = useGetMessagesQuery('messagesList', {
    pollingInterval: 120000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // Variable for displaying errors and content
  let content

  if (isLoading || isMsgLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isMsgError) {
    content = <p className="errmsg">{msgError?.data?.message}</p>
  }

  if (isSuccess && isMsgSuccess) {
    const { ids, entities } = conversations
    const { entities: msgEntities } = messages

    // Filter all the IDs of conversations where the logged in user is a participant in
    const filteredIds = ids.filter(conversationId => entities[conversationId].sender === userId || entities[conversationId].receiver === userId)

    // Variable to store all Conversation components for each conversation the logged in user is a participant in
    let tableContent

    // Variable to store last messages of each conversation the user is a part of
    let lastMessages = []

    if (filteredIds?.length) {

      filteredIds?.map(conversationId => {

        const allConvoMessages = Object.values(msgEntities)?.filter(msg => {
          return msg.conversation === conversationId
        })

        lastMessages.push(allConvoMessages[allConvoMessages.length - 1])
      })

      lastMessages?.sort((a, b) => {
        return new Date(b.time) - new Date(a.time)
      })

      tableContent = lastMessages?.map(message => {
        return filteredIds?.map(id => {
          if (message?.conversation === id) return <Conversation key={id} conversationId={id} />
        })
      })
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

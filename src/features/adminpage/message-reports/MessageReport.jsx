import { memo } from "react"
import { Link } from "react-router-dom"

import { useGetMessageReportsQuery } from "../../messagereports/messageReportsApiSlice"
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice"

const MessageReport = ({ messageReportId }) => {
  const { messageReport } = useGetMessageReportsQuery("messageReportsList", {
    selectFromResult: ({ data }) => ({
      messageReport: data?.entities[messageReportId]
    }),
  })

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[messageReport?.reporter]
    }),
  })

  if (!messageReport) return

  return (
    <div className="report-div">
      <span>
        <Link className="orange-link" to={`/messagereports/${messageReportId}`}>
          <b>{messageReport?.id}</b>
        </Link>
      </span>
      <span className="report-div-reporter">
        <span>by </span>
        <Link className="orange-link" to={`/users/${user?.id}`}>
          <b>{user?.username}</b>
        </Link>
      </span>
    </div>
  )
}

const memoizedMessageReport = memo(MessageReport)

export default memoizedMessageReport

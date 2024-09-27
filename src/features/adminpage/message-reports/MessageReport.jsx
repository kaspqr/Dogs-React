import { memo, useEffect } from "react"
import { Link } from "react-router-dom"

import { useGetMessageReportsQuery } from "../../messagereports/messageReportsApiSlice"
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice"
import { alerts } from "../../../components/alerts"

const MessageReport = ({ messageReportId }) => {
  const { messageReport } = useGetMessageReportsQuery("messageReportsList", {
    selectFromResult: ({ data }) => ({
      messageReport: data?.entities[messageReportId]
    }),
  })

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: messageReport?.reporter }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !messageReport) return

  if (isSuccess) {
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

  return
}

const memoizedMessageReport = memo(MessageReport)

export default memoizedMessageReport

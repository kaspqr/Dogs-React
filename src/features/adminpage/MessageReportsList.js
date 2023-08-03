import { useGetMessageReportsQuery } from "../messagereports/messageReportsApiSlice"
import MessageReport from "./MessageReport"

const MessageReportsList = () => {

  // GET all the message reports
  const {
    data: messageReports,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMessageReportsQuery('messageReportsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // Variable for displaying either an error or the content if the fetch was successful
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = messageReports

    // Message report component for each report
    const tableContent = ids?.length
      ? ids.map(messageReportId => <MessageReport key={messageReportId} messageReportId={messageReportId} />)
      : null

    content = (
      <>
        <table id="message-report-table" className="content-table">
          <thead>
            <tr>
              <th className="first-th">Message Report</th>
              <th>Reporter</th>
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

export default MessageReportsList

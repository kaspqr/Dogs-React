import Swal from "sweetalert2"

import { useGetMessageReportsQuery } from "../../messagereports/messageReportsApiSlice"
import MessageReport from "./MessageReport"
import { alerts } from "../../../components/alerts"

const MessageReportsList = () => {
  const {
    data: messageReports,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMessageReportsQuery('messageReportsList', {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  if (isLoading) alerts.loadingAlert("Fetching advertisement reports")
  if (isError) alerts.errorAlert(error?.data?.message)

  if (isSuccess) {
    Swal.close()

    const { ids } = messageReports

    const tableContent = ids?.length
      ? ids.map(messageReportId => <MessageReport key={messageReportId} messageReportId={messageReportId} />)
      : null

    const content = ids?.length
      ? tableContent
      : <p>There are no message reports</p>

    return content
  }

  return
}

export default MessageReportsList

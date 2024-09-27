import { useEffect } from "react";

import { useGetMessageReportsQuery } from "../../messagereports/messageReportsApiSlice";
import MessageReport from "./MessageReport";
import { alerts } from "../../../components/alerts";

const MessageReportsList = () => {
  const {
    data: messageReports,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMessageReportsQuery("messageReportsList", {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  if (isLoading) return

  if (isSuccess) {
    const { ids } = messageReports;

    if (!ids?.length) return <p>There are no message reports</p>

    return (
      <> 
        {ids?.map((id) => <MessageReport key={id} messageReportId={id} />)}
      </>
    )
  }

  return;
};

export default MessageReportsList;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetMessageByIdQuery } from "../messages/messagesApiSlice";
import useAuth from "../../hooks/useAuth";
import { useAddNewMessageReportMutation } from "./messageReportsApiSlice";
import { alerts } from "../../components/alerts";

const MessageReportPage = () => {
  const { userId } = useAuth();
  const { messageid } = useParams();

  const [report, setReport] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    data: message,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMessageByIdQuery({ id: messageid }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewMessageReport, {
    isLoading: isAddReportLoading,
    isSuccess: isAddReportSuccess,
    isError: isAddReportError,
    error: addReportError
  }] = useAddNewMessageReportMutation();

  useEffect(() => {
    if (isAddReportSuccess) {
      setReport("");
      setSuccessMsg("Thank You! We have received your report.");
    }
  }, [isAddReportSuccess]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  useEffect(() => {
    if (isAddReportError) alerts.errorAlert(`${addReportError?.data?.message}`)
  }, [isAddReportError])

  if (isLoading || isAddReportLoading) return;

  if (isSuccess) {
    if (message?.poster === userId) return <p>You cannot report your own message.</p>

    if (successMsg?.length) return <p>{successMsg}</p>

    return (
      <>
        <label htmlFor="report">
          <b>
            Reason for reporting message <span>"{message?.text}"</span>
          </b>
        </label>
        <br />
        <textarea
          className="top-spacer three-hundred"
          value={report}
          onChange={(e) => setReport(e.target.value)}
          name="report"
          id="report"
          maxLength="900"
          cols="30"
          rows="10"
        />
        <br />
        <br />
        <button
          title="Report Message"
          className="black-button three-hundred"
          onClick={async () => await addNewMessageReport({ message: messageid, reporter: userId, text: report })}
          disabled={report?.length < 1}
          style={report?.length < 1 ? { backgroundColor: "grey", cursor: "default" } : null}
        >
          Report
        </button>
      </>
    )
  }

  return
};

export default MessageReportPage;

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useGetMessageReportsQuery, useDeleteMessageReportMutation } from "../../messagereports/messageReportsApiSlice";
import { useGetMessageByIdQuery } from "../../messages/messagesApiSlice";
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";

const ReportedMessagePage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { messagereportid } = useParams();

  const { messageReport } = useGetMessageReportsQuery("messageReportsList", {
    selectFromResult: ({ data }) => ({
      messageReport: data?.entities[messagereportid],
    }),
  });

  const [deleteMessageReport, {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError,
  }] = useDeleteMessageReportMutation();

  const {
    data: message,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetMessageByIdQuery({ id: messageReport?.message }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  const {
    data: sender,
    isLoading: isSenderLoading,
    isSuccess: isSenderSuccess,
    isError: isSenderError,
    error: senderError
  } = useGetUserByIdQuery({ id: messageReport?.sender }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isDelError) alerts.errorAlert(`${delError?.data?.message}`);
  }, [isDelError]);

  useEffect(() => {
    if (isDelSuccess) navigate("/messagereports");
  }, [isDelSuccess]);

  useEffect(() => {
    if (isSenderError) alerts.errorAlert(`${senderError?.data?.message}`);
  }, [isSenderError]);

  if (isLoading || isSenderLoading || isDelLoading || !messageReport) return

  if (!isAdmin && !isSuperAdmin) return <p>You are not logged in as an admin.</p>

  if (isSuccess && isSenderSuccess) {
    return (
      <>
        <p>
          <b>Report ID {messageReport?.id}</b>
        </p>
        <p>
          <b>Message Text</b>
        </p>
        <p>{message?.text}</p>
        <br />
        <p>
          <b>
            Person who sent the message is{" "}
            <Link className="orange-link" to={`/users/${sender?.id}`}>
              {sender?.username}
            </Link>
          </b>
        </p>
        <p>
          <b>Reason for reporting</b>
        </p>
        <p>{messageReport?.text}</p>
        <br />
        <button
          onClick={async () => {
            await deleteMessageReport({ id: messageReport?.id });
          }}
          className="black-button"
        >
          Delete Report
        </button>
      </>
    );
  }

  return
};

export default ReportedMessagePage;

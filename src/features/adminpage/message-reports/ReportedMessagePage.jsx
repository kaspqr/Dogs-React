import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetMessageReportsQuery,
  useDeleteMessageReportMutation,
} from "../../messagereports/messageReportsApiSlice";
import { useGetMessagesQuery } from "../../messages/messagesApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
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

  const [
    deleteMessageReport,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteMessageReportMutation();

  const { message } = useGetMessagesQuery("messagesList", {
    selectFromResult: ({ data }) => ({
      message: data?.entities[messageReport?.message],
    }),
  });

  const { sender } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      sender: data?.entities[message?.sender],
    }),
  });

  useEffect(() => {
    if (isDelLoading) alerts.loadingAlert("Deleting Report", "Loading...");
    else Swal.close();
  }, [isDelLoading]);

  if (!isAdmin && !isSuperAdmin)
    return <p>You are not logged in as an admin.</p>;
  if (!messageReport) return;

  if (isDelError)
    alerts.errorAlert(`${delError?.data?.message}`, "Error Deleting Report");
  if (isDelSuccess) navigate("/messagereports");

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
};

export default ReportedMessagePage;

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetUserReportsQuery,
  useDeleteUserReportMutation,
} from "../../userreports/userReportsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";

const ReportedUserPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { userreportid } = useParams();

  const { userReport } = useGetUserReportsQuery("userReportsList", {
    selectFromResult: ({ data }) => ({
      userReport: data?.entities[userreportid],
    }),
  });

  const [
    deleteUserReport,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteUserReportMutation();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userReport?.reportee],
    }),
  });

  useEffect(() => {
    if (isDelLoading) alerts.loadingAlert("Deleting Report", "Loading...");
    else Swal.close();
  }, [isDelLoading]);

  if (!isAdmin && !isSuperAdmin)
    return <p>You are not logged in as an admin.</p>;
  if (!userReport) return;

  if (isDelError)
    alerts.errorAlert(`${delError?.data?.message}`, "Error Deleting Report");
  if (isDelSuccess) navigate("/userreports");

  return (
    <>
      <p>
        <b>Report ID {userReport?.id}</b>
      </p>
      <p>
        <b>
          Reportee{" "}
          <Link className="orange-link" to={`/users/${user?.id}`}>
            {user?.username}
          </Link>
        </b>
      </p>
      <p>
        <b>Reason for reporting</b>
      </p>
      <p>{userReport?.text}</p>
      <br />
      <button
        onClick={async () => {
          await deleteUserReport({ id: userReport?.id });
        }}
        className="black-button"
      >
        Delete Report
      </button>
    </>
  );
};

export default ReportedUserPage;

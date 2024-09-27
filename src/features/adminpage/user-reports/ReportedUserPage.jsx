import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useGetUserReportsQuery, useDeleteUserReportMutation } from "../../userreports/userReportsApiSlice";
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice";
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

  const [deleteUserReport, {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError,
  }] = useDeleteUserReportMutation();

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError
  } = useGetUserByIdQuery({ id: userReport?.reportee }, {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (isDelSuccess) navigate("/userreports");
  }, [isDelSuccess]);

  useEffect(() => {
    if (isDelError) alerts.errorAlert(`${delError?.data?.message}`);
  }, [isDelError]);

  useEffect(() => {
    if (isUserError) alerts.errorAlert(`${userError?.data?.message}`);
  }, [isUserError]);

  if (!isAdmin && !isSuperAdmin) return <p>You are not logged in as an admin.</p>;

  if (isDelLoading || isUserLoading || !userReport) return

  if (isUserSuccess) {
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
  }

  return
};

export default ReportedUserPage;

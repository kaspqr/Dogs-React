import { useEffect } from "react";
import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { useGetAdvertisementReportsQuery } from "../advertisementreports/advertisementReportsApiSlice";
import { useGetMessageReportsQuery } from "../messagereports/messageReportsApiSlice";
import { useGetDogReportsQuery } from "../dogreports/dogReportsApiSlice";
import { useGetUserReportsQuery } from "../userreports/userReportsApiSlice";
import { alerts } from "../../components/alerts";

const AdminPage = () => {
  const { isAdmin, isSuperAdmin } = useAuth();

  const {
    data: advertisementReports,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAdvertisementReportsQuery("advertisementReportsList", {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: messageReports,
    isLoading: isMsgLoading,
    isSuccess: isMsgSuccess,
    isError: isMsgError,
    error: msgError,
  } = useGetMessageReportsQuery("messageReportsList", {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: dogReports,
    isLoading: isDogLoading,
    isSuccess: isDogSuccess,
    isError: isDogError,
    error: dogError,
  } = useGetDogReportsQuery("dogReportsList", {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: userReports,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetUserReportsQuery("userReportsList", {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isMsgError) alerts.errorAlert(`${msgError?.data?.message}`);
  }, [isMsgError])

  useEffect(() => {
    if (isDogError) alerts.errorAlert(`${dogError?.data?.message}`);
  }, [isDogError])

  useEffect(() => {
    if (isUserError) alerts.errorAlert(`${userError?.data?.message}`);
  }, [isUserError])

  if (isLoading || isMsgLoading || isDogLoading || isUserLoading) return

  if (!isAdmin && !isSuperAdmin) return <p>You're not logged in as an admin</p>;

  if (isSuccess && isMsgSuccess && isDogSuccess && isUserSuccess) {
    return (
      <>
        {advertisementReports?.ids?.length < 1 ? (
          <p>
            <b>No Advertisement Reports</b>
          </p>
        ) : (
          <p>
            <b>
              <Link className="orange-link" to={"/advertisementreports"}>
                View {advertisementReports?.ids?.length} Advertisement Report
                {advertisementReports?.ids?.length === 1 ? null : "s"}
              </Link>
            </b>
          </p>
        )}
        {messageReports?.ids?.length < 1 ? (
          <p>
            <b>No Message Reports</b>
          </p>
        ) : (
          <p>
            <b>
              <Link className="orange-link" to={"/messagereports"}>
                View {messageReports?.ids?.length} Message Report
                {messageReports?.ids?.length === 1 ? null : "s"}
              </Link>
            </b>
          </p>
        )}
        {dogReports?.ids?.length < 1 ? (
          <p>
            <b>No Dog Reports</b>
          </p>
        ) : (
          <p>
            <b>
              <Link className="orange-link" to={"/dogreports"}>
                View {dogReports?.ids?.length} Dog Report
                {dogReports?.ids?.length === 1 ? null : "s"}
              </Link>
            </b>
          </p>
        )}
        {userReports?.ids?.length < 1 ? (
          <p>
            <b>No User Reports</b>
          </p>
        ) : (
          <p>
            <b>
              <Link className="orange-link" to={"/userreports"}>
                View {userReports?.ids?.length} User Report
                {userReports?.ids?.length === 1 ? null : "s"}
              </Link>
            </b>
          </p>
        )}
      </>
    );
  }

  return
};

export default AdminPage;

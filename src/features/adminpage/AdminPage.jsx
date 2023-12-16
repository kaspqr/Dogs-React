import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const amountOfAdvertisementReports = advertisementReports?.ids?.length;

  const {
    data: messageReports,
    isLoading: isMsgLoading,
    isSuccess: isMsgSuccess,
    isError: isMsgError,
    error: msgError,
  } = useGetMessageReportsQuery("messageReportsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const amountOfMessageReports = messageReports?.ids?.length;

  const {
    data: dogReports,
    isLoading: isDogLoading,
    isSuccess: isDogSuccess,
    isError: isDogError,
    error: dogError,
  } = useGetDogReportsQuery("dogReportsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const amountOfDogReports = dogReports?.ids?.length;

  const {
    data: userReports,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetUserReportsQuery("userReportsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const amountOfUserReports = userReports?.ids?.length;

  if (!isAdmin && !isSuperAdmin) return <p>You're not logged in as an admin</p>;

  if (isLoading || isMsgLoading || isDogLoading || isUserLoading)
    alerts.loadingAlert("Looking for reports");

  if (isError) alerts.errorAlert(error?.data?.message);
  if (isMsgError) alerts.errorAlert(msgError?.data?.message);
  if (isDogError) alerts.errorAlert(dogError?.data?.message);
  if (isUserError) alerts.errorAlert(userError?.data?.message);

  if (isSuccess && isMsgSuccess && isDogSuccess && isUserSuccess) Swal.close();

  return (
    <>
      {amountOfAdvertisementReports < 1 ? (
        <p>
          <b>No Advertisement Reports</b>
        </p>
      ) : (
        <p>
          <b>
            <Link className="orange-link" to={"/advertisementreports"}>
              View {amountOfAdvertisementReports} Advertisement Report
              {amountOfAdvertisementReports === 1 ? null : "s"}
            </Link>
          </b>
        </p>
      )}
      {amountOfMessageReports < 1 ? (
        <p>
          <b>No Message Reports</b>
        </p>
      ) : (
        <p>
          <b>
            <Link className="orange-link" to={"/messagereports"}>
              View {amountOfMessageReports} Message Report
              {amountOfMessageReports === 1 ? null : "s"}
            </Link>
          </b>
        </p>
      )}
      {amountOfDogReports < 1 ? (
        <p>
          <b>No Dog Reports</b>
        </p>
      ) : (
        <p>
          <b>
            <Link className="orange-link" to={"/dogreports"}>
              View {amountOfDogReports} Dog Report
              {amountOfDogReports === 1 ? null : "s"}
            </Link>
          </b>
        </p>
      )}
      {amountOfUserReports < 1 ? (
        <p>
          <b>No User Reports</b>
        </p>
      ) : (
        <p>
          <b>
            <Link className="orange-link" to={"/userreports"}>
              View {amountOfUserReports} User Report
              {amountOfUserReports === 1 ? null : "s"}
            </Link>
          </b>
        </p>
      )}
    </>
  );
};

export default AdminPage;

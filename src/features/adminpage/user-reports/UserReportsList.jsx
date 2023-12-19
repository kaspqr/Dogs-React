import { useEffect } from "react";
import Swal from "sweetalert2";

import { useGetUserReportsQuery } from "../../userreports/userReportsApiSlice";
import UserReport from "./UserReport";
import { alerts } from "../../../components/alerts";

const UserReportsList = () => {
  const {
    data: userReports,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserReportsQuery("userReportsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Fetching User Reports", "Loading...");
    else Swal.close();
  }, [isLoading]);

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching User Reports");

  if (isSuccess) {
    const { ids } = userReports;

    const tableContent = ids?.length
      ? ids.map((userReportId) => (
          <UserReport key={userReportId} userReportId={userReportId} />
        ))
      : null;

    const content = ids?.length ? (
      tableContent
    ) : (
      <p>There are no user reports</p>
    );

    return content;
  }

  return;
};

export default UserReportsList;

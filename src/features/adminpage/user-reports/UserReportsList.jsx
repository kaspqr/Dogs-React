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

  if (isLoading) alerts.loadingAlert("Fetching advertisement reports");
  if (isError) alerts.errorAlert(error?.data?.message);

  if (isSuccess) {
    Swal.close();

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

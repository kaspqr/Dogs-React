import { useEffect } from "react";

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
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  if (isLoading) return

  if (isSuccess) {
    const { ids } = userReports;

    if (!ids?.length) return <p>There are no user reports</p>

    return (
      <>
        {ids.map((id) => <UserReport key={id} userReportId={id} />)}
      </>
    )
  }

  return;
};

export default UserReportsList;

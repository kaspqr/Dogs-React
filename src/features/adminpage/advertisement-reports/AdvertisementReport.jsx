import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetAdvertisementReportsQuery } from "../../advertisementreports/advertisementReportsApiSlice";
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice";
import { alerts } from "../../../components/alerts";

const AdvertisementReport = ({ advertisementReportId }) => {
  const { advertisementReport } = useGetAdvertisementReportsQuery("advertisementReportsList", {
    selectFromResult: ({ data }) => ({
      advertisementReport: data?.entities[advertisementReportId],
    }),
  });

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: advertisementReport?.reporter }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !advertisementReport) return

  if (isSuccess) {
    return (
      <div className="report-div">
        <span>
          <Link
            className="orange-link"
            to={`/advertisementreports/${advertisementReportId}`}
          >
            <b>{advertisementReport?.id}</b>
          </Link>
        </span>
        <span className="report-div-reporter">
          <span>by </span>
          <Link className="orange-link" to={`/users/${user?.id}`}>
            <b>{user?.username}</b>
          </Link>
        </span>
      </div>
    );
  }

  return
};

const memoizedAdvertisementReport = memo(AdvertisementReport);

export default memoizedAdvertisementReport;

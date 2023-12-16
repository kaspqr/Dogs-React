import { Link } from "react-router-dom";

import { useGetAdvertisementReportsQuery } from "../../advertisementreports/advertisementReportsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";

import { memo } from "react";

const AdvertisementReport = ({ advertisementReportId }) => {
  const { advertisementReport } = useGetAdvertisementReportsQuery(
    "advertisementReportsList",
    {
      selectFromResult: ({ data }) => ({
        advertisementReport: data?.entities[advertisementReportId],
      }),
    }
  );

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[advertisementReport?.reporter],
    }),
  });

  if (!advertisementReport) return;

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
};

const memoizedAdvertisementReport = memo(AdvertisementReport);

export default memoizedAdvertisementReport;

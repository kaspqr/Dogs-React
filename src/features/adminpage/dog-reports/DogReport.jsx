import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetDogReportsQuery } from "../../dogreports/dogReportsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";

const DogReport = ({ dogReportId }) => {
  const { dogReport } = useGetDogReportsQuery("dogReportsList", {
    selectFromResult: ({ data }) => ({
      dogReport: data?.entities[dogReportId],
    }),
  });

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[dogReport?.reporter],
    }),
  });

  if (!dogReport) return;

  return (
    <div className="report-div">
      <span>
        <Link className="orange-link" to={`/dogreports/${dogReportId}`}>
          <b>{dogReport?.id}</b>
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

const memoizedDogReport = memo(DogReport);

export default memoizedDogReport;

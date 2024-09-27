import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetDogReportsQuery } from "../../dogreports/dogReportsApiSlice";
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice";
import { alerts } from "../../../components/alerts";

const DogReport = ({ dogReportId }) => {
  const { dogReport } = useGetDogReportsQuery("dogReportsList", {
    selectFromResult: ({ data }) => ({
      dogReport: data?.entities[dogReportId],
    }),
  });

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: dogReport?.reporter }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !dogReport) return

  if (isSuccess) {
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
  }

  return
};

const memoizedDogReport = memo(DogReport);

export default memoizedDogReport;

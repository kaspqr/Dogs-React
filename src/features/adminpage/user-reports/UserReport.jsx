import { memo, useEffect } from "react"
import { Link } from "react-router-dom"

import { useGetUserReportsQuery } from "../../userreports/userReportsApiSlice"
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice"
import { alerts } from "../../../components/alerts"

const UserReport = ({ userReportId }) => {
  const { userReport } = useGetUserReportsQuery("userReportsList", {
    selectFromResult: ({ data }) => ({
      userReport: data?.entities[userReportId]
    }),
  })

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: userReport?.reporter }, {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !userReport) return

  if (isSuccess) {
    return (
      <div className="report-div">
        <span>
          <Link className="orange-link" to={`/userreports/${userReportId}`}>
            <b>{userReport?.id}</b>
          </Link>
        </span>
        <span className="report-div-reporter">
          <span>by </span>
          <Link className="orange-link" to={`/users/${user?.id}`}>
            <b>{user?.username}</b>
          </Link>
        </span>
      </div>
    )
  }

  return
}

const memoizedUserReport = memo(UserReport)

export default memoizedUserReport

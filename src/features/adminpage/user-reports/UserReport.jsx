import { memo } from "react"
import { Link } from "react-router-dom"

import { useGetUserReportsQuery } from "../../userreports/userReportsApiSlice"
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice"

const UserReport = ({ userReportId }) => {
  const { userReport } = useGetUserReportsQuery("userReportsList", {
    selectFromResult: ({ data }) => ({
      userReport: data?.entities[userReportId]
    }),
  })

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userReport?.reporter]
    }),
  })

  if (!userReport) return

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

const memoizedUserReport = memo(UserReport)

export default memoizedUserReport

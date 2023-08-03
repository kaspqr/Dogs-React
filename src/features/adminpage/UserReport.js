import { Link } from "react-router-dom"
import { useGetUserReportsQuery } from "../userreports/userReportsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const UserReport = ({ userReportId }) => {

    // GET the userReport in props with all of it's .values
    const { userReport } = useGetUserReportsQuery("userReportsList", {
        selectFromResult: ({ data }) => ({
            userReport: data?.entities[userReportId]
        }),
    })

    // GET the user who is the poster of the userReport with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userReport?.reporter]
        }),
    })

    if (!userReport) {
        return null
    }

    return (
        <tr>
            <td className="first-td">
                <Link className="orange-link" to={`/userreports/${userReportId}`}>
                    <b>{userReport?.id}</b>
                </Link>
            </td>
            <td className="last-td">
                <Link className="orange-link" to={`/users/${user?.id}`}>
                    <b>{user?.username}</b>
                </Link>
            </td>
        </tr>
    )
}

const memoizedUserReport = memo(UserReport)

export default memoizedUserReport

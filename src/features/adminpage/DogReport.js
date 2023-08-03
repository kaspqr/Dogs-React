import { Link } from "react-router-dom"
import { useGetDogReportsQuery } from "../dogreports/dogReportsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const DogReport = ({ dogReportId }) => {

    // GET the dogReport in props with all of it's .values
    const { dogReport } = useGetDogReportsQuery("dogReportsList", {
        selectFromResult: ({ data }) => ({
            dogReport: data?.entities[dogReportId]
        }),
    })

    // GET the user who is the poster of the dogReport with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[dogReport?.reporter]
        }),
    })

    if (!dogReport) {
        return null
    }

    return (
        <tr>
            <td className="first-td">
                <Link className="orange-link" to={`/dogreports/${dogReportId}`}>
                    <b>{dogReport?.id}</b>
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

const memoizedDogReport = memo(DogReport)

export default memoizedDogReport

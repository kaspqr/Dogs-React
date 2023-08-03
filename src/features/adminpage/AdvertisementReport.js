import { Link } from "react-router-dom"
import { useGetAdvertisementReportsQuery } from "../advertisementreports/advertisementReportsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const AdvertisementReport = ({ advertisementReportId }) => {

    // GET the advertisementReport in props with all of it's .values
    const { advertisementReport } = useGetAdvertisementReportsQuery("advertisementReportsList", {
        selectFromResult: ({ data }) => ({
            advertisementReport: data?.entities[advertisementReportId]
        }),
    })

    // GET the user who is the poster of the advertisementReport with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[advertisementReport?.reporter]
        }),
    })

    if (!advertisementReport) {
        return null
    }

    return (
        <tr>
            <td className="first-td">
                <Link className="orange-link" to={`/advertisementreports/${advertisementReportId}`}>
                    <b>{advertisementReport?.id}</b>
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

const memoizedAdvertisementReport = memo(AdvertisementReport)

export default memoizedAdvertisementReport

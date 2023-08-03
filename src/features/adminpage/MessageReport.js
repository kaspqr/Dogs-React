import { Link } from "react-router-dom"
import { useGetMessageReportsQuery } from "../messagereports/messageReportsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const MessageReport = ({ messageReportId }) => {

    // GET the messageReport in props with all of it's .values
    const { messageReport } = useGetMessageReportsQuery("messageReportsList", {
        selectFromResult: ({ data }) => ({
            messageReport: data?.entities[messageReportId]
        }),
    })

    // GET the user who is the poster of the messageReport with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[messageReport?.reporter]
        }),
    })

    if (!messageReport) {
        return null
    }

    return (
        <tr>
            <td className="first-td">
                <Link className="orange-link" to={`/messagereports/${messageReportId}`}>
                    <b>{messageReport?.id}</b>
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

const memoizedMessageReport = memo(MessageReport)

export default memoizedMessageReport

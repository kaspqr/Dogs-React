import { useGetUsersQuery } from "../users/usersApiSlice"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState } from "react"
import { useAddNewUserReportMutation } from "./userReportsApiSlice"

const UserReportPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()
    const { userid } = useParams()

    const [report, setReport] = useState('')

    // GET the user with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userid]
        }),
    })

    // POST function to add a new user report
    const [addNewUserReport, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserReportMutation()

    if (userid === userId) return <p>You cannot report yourself.</p>

    const handleReportClicked = async () => {
        await addNewUserReport({ "reportee": userid, "reporter": userId, "text": report })
        navigate('/')
    }

    return (
        <>
            <label htmlFor="report">
                <b>Reason for reporting user <Link target="_blank" className="orange-link" to={`/users/${userid}`}>{user?.username}</Link></b>
            </label>
            <br />
            <br />
            <textarea 
                value={report}
                onChange={(e) => setReport(e.target.value)}
                name="report" 
                id="report" 
                maxLength="900"
                cols="30" 
                rows="10"
            />
            <br />
            <br />
            <button
                className="black-button"
                onClick={handleReportClicked}
                disabled={report?.length < 1}
                style={report?.length < 1 ? {backgroundColor: "grey"} : null}
            >
                Report
            </button>
        </>
    )
}

export default UserReportPage

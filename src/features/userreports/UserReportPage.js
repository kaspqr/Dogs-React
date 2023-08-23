import { useGetUsersQuery } from "../users/usersApiSlice"
import { useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useAddNewUserReportMutation } from "./userReportsApiSlice"

const UserReportPage = () => {

    const { userId } = useAuth()
    const { userid } = useParams()

    const [report, setReport] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

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

    // Clear the inputs if a report was POSTed successfully
    useEffect(() => {
        if (isSuccess) {
            setReport('')
            setSuccessMsg('Thank You! We have received your report.')
        }
    }, [isSuccess])

    if (userid === userId) return <p>You cannot report yourself.</p>

    const handleReportClicked = async () => {
        await addNewUserReport({ "reportee": userid, "reporter": userId, "text": report })
    }

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>{error?.data?.message}</p>

    const content = successMsg?.length ? <p>{successMsg}</p> :
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
            style={report?.length < 1 ? {backgroundColor: "grey", cursor: "default"} : null}
        >
            Report
        </button>
    </>

    return content
    
}

export default UserReportPage

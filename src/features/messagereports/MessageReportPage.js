import { useGetMessagesQuery } from "../messages/messagesApiSlice"
import { useParams, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState } from "react"
import { useAddNewMessageReportMutation } from "./messageReportsApiSlice"

const MessageReportPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()
    const { messageid } = useParams()

    const [report, setReport] = useState('')

    // GET the message with all of it's .values
    const { message } = useGetMessagesQuery("messagesList", {
        selectFromResult: ({ data }) => ({
            message: data?.entities[messageid]
        }),
    })

    // POST function to add a new message report
    const [addNewMessageReport, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewMessageReportMutation()

    if (message?.poster === userId) return <p>You cannot report your own message.</p>

    const handleReportClicked = async () => {
        await addNewMessageReport({ "message": messageid, "reporter": userId, "text": report })
        navigate('/conversations')
    }

    return (
        <>
            <label htmlFor="report">
                <b>Reason for reporting message <span>"{message?.text}"</span></b>
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

export default MessageReportPage

import { useGetMessagesQuery } from "../messages/messagesApiSlice"
import { useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useAddNewMessageReportMutation } from "./messageReportsApiSlice"

const MessageReportPage = () => {

    const { userId } = useAuth()
    const { messageid } = useParams()

    const [report, setReport] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

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

    // Clear the inputs if a report was POSTed successfully
    useEffect(() => {
        if (isSuccess) {
            setReport('')
            setSuccessMsg('Thank You! We have received your report.')
        }
    }, [isSuccess])

    if (message?.poster === userId) return <p>You cannot report your own message.</p>

    const handleReportClicked = async () => {
        await addNewMessageReport({ "message": messageid, "reporter": userId, "text": report })
    }

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>{error?.data?.message}</p>

    const content = successMsg?.length ? <p>{successMsg}</p> :
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
            style={report?.length < 1 ? {backgroundColor: "grey", cursor: "default"} : null}
        >
            Report
        </button>
    </>
    
    return content
    
}

export default MessageReportPage

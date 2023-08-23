import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useAddNewDogReportMutation } from "./dogReportsApiSlice"

const DogReportPage = () => {

    const { userId } = useAuth()
    const { dogid } = useParams()

    const [report, setReport] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    // GET the dog with all of it's .values
    const { dog } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[dogid]
        }),
    })

    // POST function to add a new dog report
    const [addNewDogReport, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewDogReportMutation()

    // Clear the inputs if a report was POSTed successfully
    useEffect(() => {
        if (isSuccess) {
            setReport('')
            setSuccessMsg('Thank You! We have received your report.')
        }
    }, [isSuccess])

    if (dog?.user === userId) return <p>You cannot report your own dog.</p>

    const handleReportClicked = async () => {
        await addNewDogReport({ "dog": dogid, "reporter": userId, "text": report })
    }

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>{error?.data?.message}</p>

    const content = successMsg?.length ? <p>{successMsg}</p> :
    <>
        <label htmlFor="report">
            <b>Reason for reporting dog <Link target="_blank" className="orange-link" to={`/dogs/${dog?.id}`}>{dog?.name}</Link></b>
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

export default DogReportPage

import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState } from "react"
import { useAddNewDogReportMutation } from "./dogReportsApiSlice"

const DogReportPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()
    const { dogid } = useParams()

    const [report, setReport] = useState('')

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

    if (dog?.user === userId) return <p>You cannot report your own dog.</p>

    const handleReportClicked = async () => {
        await addNewDogReport({ "dog": dogid, "reporter": userId, "text": report })
        navigate('/dogs')
    }

    return (
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
                style={report?.length < 1 ? {backgroundColor: "grey"} : null}
            >
                Report
            </button>
        </>
    )
}

export default DogReportPage

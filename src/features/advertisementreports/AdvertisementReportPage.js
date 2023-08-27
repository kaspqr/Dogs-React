import { useGetAdvertisementsQuery } from "../advertisements/advertisementsApiSlice"
import { useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"
import { useAddNewAdvertisementReportMutation } from "./advertisementReportsApiSlice"

const AdvertisementReportPage = () => {

    const { userId } = useAuth()
    const { advertisementid } = useParams()

    const [report, setReport] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    // GET the advertisement with all of it's .values
    const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
        selectFromResult: ({ data }) => ({
            advertisement: data?.entities[advertisementid]
        }),
    })

    // POST function to add a new advertisement report
    const [addNewAdvertisementReport, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewAdvertisementReportMutation()

    // Clear the inputs if a report was POSTed successfully
    useEffect(() => {
        if (isSuccess) {
            setReport('')
            setSuccessMsg('Thank You! We have received your report.')
        }
    }, [isSuccess])

    if (advertisement?.poster === userId) return <p>You cannot report your own advertisement.</p>

    const handleReportClicked = async () => {
        await addNewAdvertisementReport({ "advertisement": advertisementid, "reporter": userId, "text": report })
    }

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>{error?.data?.message}</p>

    const content = successMsg?.length ? <p>{successMsg}</p> :
    <>
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="report">
                <b>Reason for reporting advertisement <Link target="_blank" className="orange-link" to={`/advertisements/${advertisement?.id}`}>{advertisement?.title}</Link></b>
            </label>
            <br />
            <textarea 
                className="top-spacer three-hundred"
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
                title="Report Advertisement"
                className="black-button three-hundred"
                onClick={handleReportClicked}
                disabled={report?.length < 1}
                style={report?.length < 1 ? {backgroundColor: "grey", cursor: "default"} : null}
            >
                Report
            </button>
        </form>
    </>

    return content

}

export default AdvertisementReportPage

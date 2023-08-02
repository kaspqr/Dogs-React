import { useGetAdvertisementsQuery } from "../advertisements/advertisementsApiSlice"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState } from "react"
import { useAddNewAdvertisementReportMutation } from "./advertisementReportsApiSlice"

const AdvertisementReportPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()
    const { advertisementid } = useParams()

    const [report, setReport] = useState('')

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

    if (advertisement?.poster === userId) return <p>You cannot report your own advertisement.</p>

    const handleReportClicked = async () => {
        await addNewAdvertisementReport({ "advertisement": advertisementid, "reporter": userId, "text": report })
        navigate('/')
    }

    return (
        <>
            <label htmlFor="report">
                <b>Reason for reporting advertisement <Link target="_blank" className="orange-link" to={`/advertisements/${advertisement?.id}`}>{advertisement?.title}</Link></b>
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

export default AdvertisementReportPage

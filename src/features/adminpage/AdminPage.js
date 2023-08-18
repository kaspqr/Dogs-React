import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { useGetAdvertisementReportsQuery } from "../advertisementreports/advertisementReportsApiSlice"
import { useGetMessageReportsQuery } from "../messagereports/messageReportsApiSlice"
import { useGetDogReportsQuery } from "../dogreports/dogReportsApiSlice"
import { useGetUserReportsQuery } from "../userreports/userReportsApiSlice"

const AdminPage = () => {

    // Check if the logged in user is an admin
    const { isAdmin, isSuperAdmin } = useAuth()

    // GET all the advertisement reports
    const {
        data: advertisementReports,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAdvertisementReportsQuery('advertisementReportsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let amountOfAdvertisementReports = 0

    if (isSuccess) {
        const { ids } = advertisementReports
        amountOfAdvertisementReports = ids?.length
    }

    // GET all the message reports
    const {
        data: messageReports,
        isLoading: isMsgLoading,
        isSuccess: isMsgSuccess,
        isError: isMsgError,
        error: msgError
    } = useGetMessageReportsQuery('messageReportsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let amountOfMessageReports = 0

    if (isMsgSuccess) {
        const { ids } = messageReports
        amountOfMessageReports = ids?.length
    }

    // GET all the dog reports
    const {
        data: dogReports,
        isLoading: isDogLoading,
        isSuccess: isDogSuccess,
        isError: isDogError,
        error: dogError
    } = useGetDogReportsQuery('dogReportsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let amountOfDogReports = 0

    if (isDogSuccess) {
        const { ids } = dogReports
        amountOfDogReports = ids?.length
    }

    // GET all the user reports
    const {
        data: userReports,
        isLoading: isUserLoading,
        isSuccess: isUserSuccess,
        isError: isUserError,
        error: userError
    } = useGetUserReportsQuery('userReportsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let amountOfUserReports = 0

    if (isUserSuccess) {
        const { ids } = userReports
        amountOfUserReports = ids?.length
    }

    if (!isAdmin && !isSuperAdmin) return <p>You're not logged in as an admin</p>

    if (isLoading || isMsgLoading || isDogLoading || isUserLoading) return <p>Loading...</p>

    if (isError) return <p>{error?.data?.message}</p>
    if (isMsgError) return <p>{msgError?.data?.message}</p>
    if (isDogError) return <p>{dogError?.data?.message}</p>
    if (isUserError) return <p>{userError?.data?.message}</p>

    return (
        <> 
            {amountOfAdvertisementReports < 1 
                ? <p><b>No Advertisement Reports</b></p> 
                : <p><b><Link className="orange-link" to={'/advertisementreports'}>
                    View {amountOfAdvertisementReports} Advertisement {amountOfAdvertisementReports === 1 ? 'Report' : 'Reports'}
                </Link></b></p>
            }

            {amountOfMessageReports < 1 
                ? <p><b>No Message Reports</b></p> 
                : <p><b><Link className="orange-link" to={'/messagereports'}>
                    View {amountOfMessageReports} Message {amountOfMessageReports === 1 ? 'Report' : 'Reports'}
                </Link></b></p>
            }

            {amountOfDogReports < 1 
                ? <p><b>No Dog Reports</b></p> 
                : <p><b><Link className="orange-link" to={'/dogreports'}>
                    View {amountOfDogReports} Dog {amountOfDogReports === 1 ? 'Report' : 'Reports'}
                </Link></b></p>
            }

            {amountOfUserReports < 1 
                ? <p><b>No User Reports</b></p> 
                : <p><b><Link className="orange-link" to={'/userreports'}>
                    View {amountOfUserReports} User {amountOfUserReports === 1 ? 'Report' : 'Reports'}
                </Link></b></p>
            }
        </>
    )
}

export default AdminPage

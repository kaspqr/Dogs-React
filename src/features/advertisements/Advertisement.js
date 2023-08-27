import { Link } from "react-router-dom"
import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"
import AdIcon from "../../config/images/AdIcon.jpg"

const Advertisement = ({ advertisementId }) => {

    // GET the advertisement in props with all of it's .values
    const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
        selectFromResult: ({ data }) => ({
            advertisement: data?.entities[advertisementId]
        }),
    })

    // GET the user who is the poster of the advertisement with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[advertisement?.poster]
        }),
    })

    if (!advertisement) {
        return null
    }

    return (
        <div className="advertisement-div">
            <div className="advertisement-div-image">
                {advertisement?.image?.length 
                    ? <img className="advertisement-picture" src={advertisement?.image} alt="Advertisement" />
                    : <img className="advertisement-picture" src={AdIcon} alt="Advertisement" />
                }
            </div>
            <div className="advertisement-div-info">
                <p><Link className="orange-link" to={`/advertisements/${advertisementId}`}><b>{advertisement?.title}</b></Link></p>
                <br />
                <p><b>{advertisement?.type}</b></p>
                <p>{advertisement?.type === 'Require Female Dog' || advertisement?.type === 'Require Male Dog' ? advertisement?.breed : null}</p>
                <p>{advertisement?.type !== 'Found' && advertisement?.type !== 'Lost' ? <>{advertisement?.currency}{advertisement?.price}</> : null}</p>
                <p>{advertisement?.region?.length && advertisement?.region !== 'none ' ? `${advertisement?.region}, ` : null}{advertisement?.country}</p>
                <br />
                <p className="advertisement-div-admin">Posted by <Link className="orange-link" to={`/users/${user?.id}`}><b>{user?.username}</b></Link></p>
            </div>
        </div>
    )
}

const memoizedAdvertisement = memo(Advertisement)

export default memoizedAdvertisement

import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useNavigate, useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const AdvertisementPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { advertisementid } = useParams()

    const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
        selectFromResult: ({ data }) => ({
            advertisement: data?.entities[advertisementid]
        }),
    })

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[advertisement?.poster]
        }),
    })

    if (!advertisement) {
        return null
    }

    return (
        <>
            {userId === advertisement?.poster ? <Link className="edit-advertisement-link" to={`/advertisements/edit/${advertisement.id}`}><button>Edit</button></Link> : null}
            <p className="advertisement-title-p">
                <span className="advertisement-page-title">{advertisement?.title}</span>
                <span className="nav-right"><b>Posted by <Link to={`/users/${user.id}`}>{user.username}</Link></b></span>
            </p>
            <p><b>Type:</b> {advertisement?.type}</p>
            {advertisement?.type !== "Found" && advertisement?.type !== "Lost" ? <p><b>Price:</b> {advertisement?.price}</p> : null}
            <p><b>Info:</b></p>
            <p>{advertisement?.info}</p>
        </>
    )
}

export default AdvertisementPage

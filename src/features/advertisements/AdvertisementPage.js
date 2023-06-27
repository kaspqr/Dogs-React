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

    let content = null

    if (userId === advertisement.poster) {
        content = (
            <button
                onClick={() => navigate(`/advertisements/edit/${advertisement.id}`)}
            >
                <FontAwesomeIcon icon={faSave} />
            </button>
        )
    }

    return (
        <>
            {content}
            <p className="advertisement-title-p">
                <span className="advertisement-page-title">{advertisement?.title}</span>
                <span className="nav-right"><b>Posted by <Link to={`/users/${user.id}`}>{user.username}</Link></b></span>
            </p>
            <p>Type: {advertisement?.type}</p>
            <p>Price: {advertisement?.price}</p>
            <p>Info:</p>
            <p>{advertisement?.info}</p>
        </>
    )
}

export default AdvertisementPage

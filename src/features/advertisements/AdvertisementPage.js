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
            <p>Title: {advertisement?.title}</p>
            <p>Poster: <Link to={`/users/${user.id}`}>{user.username}</Link></p>
            <p>Type: {advertisement?.type}</p>
            <p>Price: {advertisement?.price}</p>
            <p>Info:</p>
            <br />
            <p>{advertisement?.info}</p>
        </>
    )
}

export default AdvertisementPage

import { useGetAdvertisementsQuery, useDeleteAdvertisementMutation } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const AdvertisementPage = () => {

    const navigate = useNavigate()

    const { userId, isAdmin, isSuperAdmin } = useAuth()

    const { advertisementid } = useParams()

    // GET the advertisement with all of it's .values
    const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
        selectFromResult: ({ data }) => ({
            advertisement: data?.entities[advertisementid]
        }),
    })

    // GET the user who is the poster of the advertisement with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[advertisement?.poster]
        }),
    })

    // DELETE method to delete the advertisement
    const [deleteAdvertisement, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAdvertisementMutation()

    const handleAdminDelete = async () => {
        await deleteAdvertisement({ id: advertisement?.id })
        navigate('/')
    }

    if (!advertisement) {
        return null
    }

    return (
        <>
            {userId === advertisement?.poster ? <Link className="edit-advertisement-link" to={`/advertisements/edit/${advertisement.id}`}><button className="black-button">Edit</button></Link> : null}
            <p className="advertisement-title-p">
                <span className="advertisement-page-title">{advertisement?.title}</span>
                <span className="nav-right"><b>Posted by <Link className="orange-link" to={`/users/${user.id}`}>{user.username}</Link></b></span>
            </p>
            <p><b>{advertisement?.type}</b></p>
            {advertisement?.type !== "Found" ? <p><b>{advertisement?.currency}{advertisement?.price}</b></p> : null}
            <br />
            <p><b>Location</b></p>
            <p>{advertisement?.region ? advertisement?.region + ', ' : null}{advertisement?.country}</p>
            <p><b>Info</b></p>
            <p>{advertisement?.info}</p>
            <br />
            <br />
            {userId?.length && advertisement?.poster !== userId
                ? <button 
                    className="black-button"
                    onClick={() => navigate(`/reportadvertisement/${advertisement?.id}`)}
                >
                    Report Advertisement
                </button>
                : null
            }
            {isAdmin || isSuperAdmin
                ? <><br /><br /><button className="black-button" onClick={handleAdminDelete}>
                    Delete as Admin
                </button></>
                : null
            }
        </>
    )
}

export default AdvertisementPage

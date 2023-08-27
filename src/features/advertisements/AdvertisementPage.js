import { useGetAdvertisementsQuery, useDeleteAdvertisementMutation } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useState, useEffect } from "react"

const AdvertisementPage = () => {

    const navigate = useNavigate()

    const { userId, isAdmin, isSuperAdmin } = useAuth()

    const { advertisementid } = useParams()

    // State for checking how wide is the user's screen
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    // Function for handling the resizing of screen
    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    // Always check if a window is being resized
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize)
        }
    }, [])

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
        isLoading: isDelLoading,
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAdvertisementMutation()

    const handleAdminDelete = async () => {
        await deleteAdvertisement({ id: advertisement?.id })
    }

    if (!advertisement) {
        return <p>Advertisement doesn't exist</p>
    }

    if (isDelLoading) return <p>Loading...</p>
    if (isDelError) return <p>{delerror?.data?.message}</p>
    if (isDelSuccess) navigate('/')

    return (
        <>
            <p className="advertisement-title-p">
                <span className="advertisement-page-title">{advertisement?.title}</span>
                {windowWidth > 600 ? null : <br />}
                <span className={windowWidth > 600 ? "nav-right" : null}><b>Posted by <Link className="orange-link" to={`/users/${user?.id}`}>{user?.username}</Link></b></span>
            </p>
            {advertisement?.image?.length ? <><p><img className="three-hundred" src={advertisement?.image} alt="Advertisement" /></p><br /></> : null}
            <p><b>{advertisement?.type}</b></p>
            <p>
                {advertisement?.type === 'Require Female Dog' || advertisement?.type === 'Require Male Dog' 
                    ? advertisement?.breed?.length 
                        ? advertisement?.breed 
                        : 'Any breed'
                    : null
                }
            </p>
            {advertisement?.type !== "Found" && advertisement?.type !== "Lost" ? <p><b>{advertisement?.currency}{advertisement?.price}</b></p> : null}
            <br />
            <p><b>Location</b></p>
            <p>{advertisement?.region ? advertisement?.region + ', ' : null}{advertisement?.country}</p>
            <br />
            <p><b>Info</b></p>
            <p>{advertisement?.info}</p>
            <br />
            {userId === advertisement?.poster ? <><Link className="edit-advertisement-link" to={`/advertisements/edit/${advertisement?.id}`}><button title="Edit" className="black-button three-hundred">Edit</button></Link></> : null}
            {userId?.length && advertisement?.poster !== userId
                ? <><button 
                    className="black-button three-hundred"
                    onClick={() => navigate(`/reportadvertisement/${advertisement?.id}`)}
                >
                    Report Advertisement
                </button><br /><br /></>
                : null
            }
            {isAdmin || isSuperAdmin
                ? <><button title="Delete as Admin" className="black-button three-hundred" onClick={handleAdminDelete}>
                    Delete as Admin
                </button></>
                : null
            }
        </>
    )
}

export default AdvertisementPage

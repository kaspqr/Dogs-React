import { Link } from "react-router-dom"
import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo, useState, useEffect } from "react"

const Advertisement = ({ advertisementId }) => {

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
        <tr>
            <td className="first-td"><Link className="orange-link" to={`/advertisements/${advertisementId}`}><b>{advertisement?.title}</b></Link></td>
            {windowWidth > 600 
                ? <><td><Link className="orange-link" to={`/users/${user?.id}`}><b>{user?.username}</b></Link></td>
                    <td>{advertisement?.type}</td></>
                : null
            }
            <td className="last-td">{advertisement?.type !== 'Found' ? <>{advertisement?.currency}{advertisement?.price}</> : null}</td>
        </tr>
    )
}

const memoizedAdvertisement = memo(Advertisement)

export default memoizedAdvertisement

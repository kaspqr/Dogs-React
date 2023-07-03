import { Link } from "react-router-dom"
import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const Advertisement = ({ advertisementId }) => {

    const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
        selectFromResult: ({ data }) => ({
            advertisement: data?.entities[advertisementId]
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
        <tr>
            <td><Link className="orange-link" to={`/advertisements/${advertisementId}`}><b>{advertisement?.title}</b></Link></td>
            <td><Link className="orange-link" to={`/users/${user?.id}`}><b>{user?.username}</b></Link></td>
            <td>{advertisement?.type}</td>
            <td>{advertisement?.type !== 'Found' ? advertisement?.price : null}</td>
        </tr>
    )
}

const memoizedAdvertisement = memo(Advertisement)

export default memoizedAdvertisement

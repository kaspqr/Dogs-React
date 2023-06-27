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
            <td><Link to={`/advertisements/${advertisementId}`}>{advertisement?.title}</Link></td>
            <td><Link to={`/users/${user?.id}`}>{user?.username}</Link></td>
            <td>{advertisement?.type}</td>
            <td>{advertisement?.price}</td>
        </tr>
    )
}

const memoizedAdvertisement = memo(Advertisement)

export default memoizedAdvertisement

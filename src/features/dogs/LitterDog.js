import { Link } from "react-router-dom"
import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const LitterDog = ({ dogId }) => {

    const { dog } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[dogId]
        }),
    })

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[dog?.user]
        }),
    })

    if (!dog) {
        return null
    }

    return (
        <tr>
            <td><Link to={`/dogs/${dogId}`}>{dog.name}</Link></td>
            <td>{dog.female === true ? 'Female' : 'Male'}</td>
            <td><Link to={`/users/${user?.id}`}>{user?.username}</Link></td>
        </tr>
    )
}

const memoizedLitterDog = memo(LitterDog)

export default memoizedLitterDog

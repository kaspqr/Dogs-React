import { Link } from "react-router-dom"
import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const LitterDog = ({ dogId }) => {

    // GET the dog with all of it's .values
    const { dog } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[dogId]
        }),
    })

    // GET the user who is the dog's administrative user with all of it's .values
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
            <td><Link className="orange-link" to={`/dogs/${dogId}`}><b>{dog.name}</b></Link></td>
            <td>{dog.female === true ? 'Girl' : 'Boy'}</td>
            <td><Link className="orange-link" to={`/users/${user?.id}`}><b>{user?.username}</b></Link></td>
        </tr>
    )
}

const memoizedLitterDog = memo(LitterDog)

export default memoizedLitterDog

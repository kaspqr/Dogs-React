import { Link } from "react-router-dom"
import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const Dog = ({ dogId }) => {

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

    let gender

    if (typeof dog?.female === 'boolean') {
        if (dog?.female === true) {
            gender = 'Female' 
        } else {
            gender = 'Male'
        }
    }

    return (
        <tr>
            <td><Link to={`/dogs/${dogId}`}>{dog.name}</Link></td>
            <td>{dogId}</td>
            <td><Link to={`/users/${user?.id}`}>{user?.username}</Link></td>
            <td>{dog.breed}</td>
            <td>{gender}</td>
            <td>{dog.birth}</td>
        </tr>
    )
}

const memoizedDog = memo(Dog)

export default memoizedDog

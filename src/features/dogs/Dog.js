import { useNavigate } from "react-router-dom"
import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { memo } from "react"

const Dog = ({ dogId }) => {

    const navigate = useNavigate()

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

    if (dog) {
        const birth = new Date(dog.birth).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        return (
            <tr 
                onClick={() => navigate(`/dogs/${dogId}`)}
            >
                <td>{dog.name}</td>
                <td>{user.username}</td>
                <td>{dog.breed}</td>
                <td>{gender}</td>
                <td>{birth}</td>
            </tr>
        )
    } else return null
}

const memoizedDog = memo(Dog)

export default memoizedDog

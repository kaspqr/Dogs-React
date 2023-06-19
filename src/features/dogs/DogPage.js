import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useNavigate, useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const DogPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { dogid } = useParams()

    const { dog } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            dog: data?.entities[dogid]
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

    let content = null

    if (userId === dog.user) {
        content = (
            <button
                onClick={() => navigate(`/dogs/edit/${dog.id}`)}
            >
                <FontAwesomeIcon icon={faSave} />
            </button>
        )
    }

    return (
        <>
            {content}
            <p>Administrative user: {user.username}</p>
            <p>Gender: {gender}</p>
            <p>Breed: {dog?.breed}</p>
        </>
    )
}

export default DogPage

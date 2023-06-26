import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useNavigate, useParams, Link } from "react-router-dom"
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

    const { owner } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            owner: data?.entities[dog?.owner]
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
            <p>Name: {dog?.name}</p>
            <p>Administrative user: <Link to={`/users/${user.id}`}>{user.username}</Link></p>
            <p>Owner: {owner ? <Link to={`/users/${owner.id}`}>{owner.username}</Link> : 'Not added'}</p>
            <p>Gender: {gender}</p>
            <p>Breed: {dog?.breed}</p>
            <p>Litter: {dog?.litter ? <Link to={`/litters/${dog.litter}`}>{dog.litter}</Link> : 'Not added'}</p>
            <p>Heat: {dog?.heat === true ? 'Yes' : 'No'}</p>
            <p>Sterilized: {dog?.sterilized === true ? 'Yes' : 'No'}</p>
            <p>Birth: {dog?.birth}</p>
            {dog?.death?.length ? <p>Death: {dog?.death}</p> : null}
            <p>Microchipped: {dog?.microchipped === true ? 'Yes' : 'No'}</p>
            <p>Chipnumber: {dog?.chipnumber ? dog?.chipnumber : 'Not added'}</p>
            <p>Passport: {dog?.passport === true ? 'Yes' : 'No'}</p>
            <p>Location: {dog?.location}</p>
            <p>Info: {dog?.info}</p>
        </>
    )
}

export default DogPage

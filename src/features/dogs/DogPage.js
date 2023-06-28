import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useNavigate, useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

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

    let content = null

    if (userId === dog.user) {
        content = (
            <>
                <button
                    onClick={() => navigate(`/dogs/edit/${dog.id}`)}
                >
                    Edit
                </button>
                <br />
                <br />
            </>
        )
    }

    return (
        <>
            {content}
            <p className="dog-page-name">{dog?.name}</p>
            <p><b>Administrative user:</b> <Link to={`/users/${user.id}`}>{user.username}</Link></p>
            <p><b>Owner:</b> {owner ? <Link to={`/users/${owner.id}`}>{owner.username}</Link> : 'Not added'}</p>
            <p><b>Gender:</b> {dog?.female === true ? 'Female' : 'Male'}</p>
            <p><b>Breed:</b> {dog?.breed}</p>
            <p><b>Litter:</b> {dog?.litter ? <Link to={`/litters/${dog.litter}`}>{dog.litter}</Link> : 'Not added'}</p>
            {dog?.female === true && dog?.sterilized === false ? <p><b>Currently in heat?:</b> {dog?.heat === true ? 'Yes' : 'No'}</p> : null}
            <p><b>Sterilized:</b> {dog?.sterilized === true ? 'Yes' : 'No'}</p>
            <p><b>Birth:</b> {dog?.birth}</p>
            {dog?.death?.length ? <p><b>Death:</b> {dog?.death}</p> : null}
            <p><b>Microchipped:</b> {dog?.microchipped === true ? 'Yes' : 'No'}</p>
            <p><b>Chipnumber:</b> {dog?.chipnumber ? dog?.chipnumber : 'Not added'}</p>
            <p><b>Passport:</b> {dog?.passport === true ? 'Yes' : 'No'}</p>
            <p><b>Location:</b> {dog?.location}</p>
            <p><b>Info:</b></p>
            <p>{dog?.info}</p>
        </>
    )
}

export default DogPage

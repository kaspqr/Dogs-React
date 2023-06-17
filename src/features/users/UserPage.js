import { useParams } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery } from "./usersApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

const UserPage = () => {

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { id } = useParams()

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    if (!user) return <p>User not found</p>

    const handleEdit = () => navigate(`/users/edit/${id}`)

    const content = (
        <>
            {userId === id 
                ? <button
                    onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button> 
                : null
            }
            <p>Username: {user.username}</p>
            <p>Name: {user.name}</p>
            <p>Location: {user.location}</p>
            <p>Bio: {user.bio}</p>
        </>
    )

    return content
}

export default UserPage

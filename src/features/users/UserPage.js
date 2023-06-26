import { useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery } from "./usersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
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


    const {
        data: dogs,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDogsQuery('dogsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let dogContent
    
    if (isLoading) dogContent = <p>Loading...</p>
    
    if (isError) {
        dogContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids, entities } = dogs

        let filteredDogs

        const filteredIds = ids.filter(dogId => entities[dogId].user === user.id)

        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        let tableContent

        if (filteredDogs?.length) {
            tableContent = filteredDogs.map(dog => (
                <tr key={dog.id}>
                    <td><Link to={`/dogs/${dog.id}`}>{dog.name}</Link></td>
                    <td>{dog.id}</td>
                    <td>{dog.breed}</td>
                    <td>{dog.female === true ? 'Female' : 'Male'}</td>
                    <td>{dog.birth}</td>
                </tr>
            ))
        }

        console.log(ids)
        console.log(filteredIds)
        console.log(filteredDogs)
        console.log(tableContent)
      
        dogContent = (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Breed</th>
                        <th>Gender</th>
                        <th>Born</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

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
            <br />
            <p>Dogs administrated:</p>
            {dogContent}
        </>
    )

    return content
}

export default UserPage

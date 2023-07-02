import { useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery } from "./usersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
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
            <table className="content-table">
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
                    className="user-page-edit-button black-button"
                    onClick={handleEdit}
                >
                    Edit Profile
                </button> 
                : null
            }
            <p className="user-page-username">{user.username}</p>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Location:</b> {user.location}</p>
            <p><b>Bio:</b></p>
            <p>{user.bio}</p>
            <br />
            <p><b>Dogs administrated:</b></p>
            <br />
            {dogContent}
        </>
    )

    return content
}

export default UserPage

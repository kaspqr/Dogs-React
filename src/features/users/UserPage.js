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

    let filteredDogs
    
    if (isSuccess) {
        const { ids, entities } = dogs

        const filteredIds = ids.filter(dogId => entities[dogId].user === user.id)

        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        let tableContent

        if (filteredDogs?.length) {
            tableContent = filteredDogs.map(dog => (
                <tr key={dog.id}>
                    <td><Link className="orange-link" to={`/dogs/${dog.id}`}><b>{dog.name}</b></Link></td>
                    <td>{dog.breed}</td>
                    <td>{dog.female === true ? 'Female' : 'Male'}</td>
                    <td>{dog.birth.split(' ').slice(1, 4).join(' ')}</td>
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
                        <th>Breed</th>
                        <th>Good</th>
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
            <p><b>{user.name}</b></p>
            <br />
            <p><b>From </b>{user.location}</p>
            {user?.bio?.length ? <><p><b>Bio</b></p><p>{user.bio}</p></> : null}
            {filteredDogs?.length ? <><br /><p><b>Dogs administered</b></p><br />{dogContent}</> : null}
        </>
    )

    return content
}

export default UserPage

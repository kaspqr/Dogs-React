import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { useGetConversationsQuery, useAddNewConversationMutation } from "../conversations/conversationsApiSlice"
import { useState, useEffect } from "react"

const UserPage = () => {

    const navigate = useNavigate()

    // User that's logged in
    const { userId, isAdmin, isSuperAdmin } = useAuth()

    // User whose page we're on
    const { id } = useParams()

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize)
        }
    }, [])

    // POST method for /conversations
    const [addNewConversation, {
        isLoading: isLoadingNewConversation,
        isSuccess: isSuccessNewConversation,
        isError: isErrorNewConversation,
        error: errorNewConversation
    }] = useAddNewConversationMutation()

    // GET the user whose page we're on with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    // PATCH function for updating the user
    const [updateUser, {
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateUserMutation()

    // GET all conversations
    const {
        data: conversations,
        isLoading: isConversationLoading,
        isSuccess: isConversationSuccess,
        isError: isConversationError,
        error: conversationError
    } = useGetConversationsQuery('conversationsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    // Variable for either an error or content after fetching the user's dogs
    let dogContent

    // Variable to store the ID of the conversation between the two users
    let filteredConversation
    
    if (isConversationSuccess) {
        const { ids, entities } = conversations

        const filteredId = ids.find(conversationId => {
            return (entities[conversationId].sender === id && entities[conversationId].receiver === userId)
                || (entities[conversationId].receiver === id && entities[conversationId].sender === userId)
        })

        if (filteredId?.length) {
            filteredConversation = filteredId
        }
    }


    // GET all dogs
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
    
    if (isLoading || isConversationLoading) dogContent = <p>Loading...</p>
    
    if (isError) {
        dogContent = <p className="errmsg">{error?.data?.message}</p>
    }

    // Variable for storing all IDs of dogs that belong to the user
    let filteredDogs
    
    if (isSuccess) {
        const { ids, entities } = dogs

        const filteredIds = ids?.filter(dogId => entities[dogId]?.user === user?.id)

        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        // Variable to contain '<tr>' rows for each dog the user administrates
        let tableContent

        if (filteredDogs?.length) {
            tableContent = filteredDogs.map(dog => (
                <tr key={dog.id}>
                    <td><Link className="orange-link" to={`/dogs/${dog.id}`}><b>{dog.name}</b></Link></td>
                    {windowWidth > 600 ? <><td>{dog.breed}</td><td>{dog.female === true ? 'Female' : 'Male'}</td></> : null}
                    <td>{dog.birth.split(' ').slice(1, 4).join(' ')}</td>
                </tr>
            ))
        }
      
        dogContent = (
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        {windowWidth > 600 ? <><th>Breed</th><th>Good</th></> : null}
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

    // Only available when userId === id (the user visiting === the user whose page we're on)
    const handleEdit = () => navigate(`/users/edit/${id}`)

    // If the user visiting is someone else, they can send a message instead
    const handleMessage = async () => {
        // If they already have a conversation started, navigate to it
        if (filteredConversation?.length) {
            navigate(`/conversations/${filteredConversation}`)
        } else {
            // Create a new conversation, then navigate to it
            const response = await addNewConversation({ sender: userId, receiver: id })

            if (response) {
                navigate(`/conversations/${response?.data?.newConversationId}`)
            }
        }
    }

    const handleBanUser = async () => {
        console.log('trying to ban user')
        const result = await updateUser({ id: user?.id, active: false })
        console.log(result)
    }

    const handleUnbanUser = async () => {
        console.log('trying to unban user')
        const result = await updateUser({ id: user?.id, active: true })
        console.log(result)
    }

    const content = (
        <>
            <p className="user-page-username">
                {user.username}
                {userId === id 
                    ? <button
                        className="user-page-edit-button black-button"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button> 
                    : null
                }
                {userId?.length && userId !== id 
                    ? <button
                        className="user-page-edit-button black-button"
                        onClick={handleMessage}
                    >
                        Message
                    </button> 
                    : null
                }
            </p>
            <p><b>{user.name}</b></p>
            <br />
            <p><b>From </b>{user?.region && user?.region !== 'none ' ? `${user?.region}, ` : null}{user?.country}</p>
            {user?.bio?.length ? <><p><b>Bio</b></p><p>{user.bio}</p></> : null}
            {filteredDogs?.length ? <><br /><p><b>Dogs administered</b></p><br />{dogContent}</> : null}
            <br />
            <br />
            {userId?.length && id !== userId
                ? <button 
                    className="black-button"
                    onClick={() => navigate(`/reportuser/${id}`)}
                >
                    Report User
                </button>
                : null
            }
            {(isAdmin || isSuperAdmin) && !user?.roles?.includes("Admin", "SuperAdmin") && id !== userId
                ? user?.active
                    ? <><br /><br /><button className="black-button" onClick={handleBanUser}>Ban User</button></>
                    : <><br /><br /><button className="black-button" onClick={handleUnbanUser}>Unban User</button></>
                : null
            }
        </>
    )

    return content
}

export default UserPage

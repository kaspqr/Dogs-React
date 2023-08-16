import { useParams, Link, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice"
import { useGetDogsQuery, useUpdateDogMutation } from "../dogs/dogsApiSlice"
import { useGetConversationsQuery, useAddNewConversationMutation } from "../conversations/conversationsApiSlice"
import { useGetDogProposesQuery, useAddNewDogProposeMutation, useDeleteDogProposeMutation } from "../dogs/proposeDogApiSlice"
import { useState, useEffect } from "react"

const UserPage = () => {

    const navigate = useNavigate()

    // User that's logged in
    const { userId, isAdmin, isSuperAdmin } = useAuth()

    const [selectedProposeDog, setSelectedProposeDog] = useState('')
    const [selectedAcceptDog, setSelectedAcceptDog] = useState('')

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

    // POST method for /dogproposes
    const [addNewDogPropose, {
        isLoading: isLoadingNewDogPropose,
        isSuccess: isSuccessNewDogPropose,
        isError: isErrorNewDogPropose,
        error: errorNewDogPropose
    }] = useAddNewDogProposeMutation()

    // DELETE method for /dogproposes
    const [deleteDogPropose, {
        isLoading: isLoadingDeleteDogPropose,
        isSuccess: isSuccessDeleteDogPropose,
        isError: isErrorDeleteDogPropose,
        error: errorDeleteDogPropose
    }] = useDeleteDogProposeMutation()

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

    // PATCH function for updating a dog
    const [updateDog, {
        isLoading: isUpdateDogLoading,
        isSuccess: isUpdateDogSuccess,
        isError: isUpdateDogError,
        error: updateDogError
    }] = useUpdateDogMutation()

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

    // GET all dog proposals
    const {
        data: dogproposes,
        isLoading: isDogProposeLoading,
        isSuccess: isDogProposeSuccess,
        isError: isDogProposeError,
        error: dogProposeError
    } = useGetDogProposesQuery('dogProposesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    // Variable for either an error or content after fetching the user's dogs
    let dogContent

    let proposeDogContent

    let myProposalsContent

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

    const handleProposeDog = async () => {
        await addNewDogPropose({ "dog": selectedProposeDog, "user": user?.id })
        setSelectedProposeDog('')
    }

    const handleAcceptDog = async () => {
        await updateDog({ "id": selectedAcceptDog, "user": userId })
        setSelectedAcceptDog('')
    }

    // Variable for storing all dogs that belong to the user
    let filteredDogs

    // Variable for storing all dogs that belong to the logged in user
    let filteredProposeDogs = []

    // Variable for storing all proposals for dogs that were made to the user whose page we're on
    let filteredProposedDogs

    let myProposals = []
    
    if (isSuccess && isDogProposeSuccess) {
        const { ids, entities } = dogs

        const { ids: proposeIds, entities: proposeEntities } = dogproposes

        // All IDs of Dog Proposes that were made to the user whose page we're on
        const filteredProposeIds = proposeIds?.filter(proposeId => proposeEntities[proposeId]?.user === user?.id)

        // All IDs of Dog Proposes that were made to the user that's logged in
        const filteredMyProposeIds = userId !== user?.id 
            ? proposeIds?.filter(proposeId => proposeEntities[proposeId]?.user === userId)
            : null
        
        // All IDs of dogs that are owned by the user whose page we're on
        const filteredIds = ids?.filter(dogId => entities[dogId]?.user === user?.id)

        // All Dog Objects of the user that's logged in AND is not the user whose page we're on
        // To eliminate the possibility of proposing your own dogs to yourself
        const filteredProposeDogIds = userId?.length && user?.id !== userId
            ? ids?.filter(dogId => entities[dogId]?.user === userId)
            : null

        // Assign filteredDogs an array of Dog Objects that the user whose page we're on, owns
        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        // If there are Dog Proposes made to the user that's logged in
        // And there are Dogs that the user whose page we're on, owns
        // Fill myProposals array with dogs 
        filteredMyProposeIds?.forEach(proposal => { // For each proposal made to the user that's logged in
            if (filteredIds?.includes(proposeEntities[proposal]?.dog)) { // If the user whose page we're on has a dog whose ID matches with the proposals dog
                myProposals.push(entities[proposeEntities[proposal]?.dog])
            }
        })

        // If dogs were proposed to the user whose page we're on, fill filteredProposedDogs array with said dog objects
        if (filteredProposeIds?.length) {
            filteredProposedDogs = filteredProposeIds.map(proposeId => proposeEntities[proposeId]?.dog)
        }

        // For each dog's id that's owned by the logged in user
        // Check that said dog is not included in the DogProposes that have been made to the user whose page we're on
        // Add those dogs to filteredProposeDogs array
        filteredProposeDogIds?.forEach(dogId => {
            if (!filteredProposedDogs?.includes(dogId)) {
                filteredProposeDogs.push(entities[dogId])
            }
        })

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

        if (filteredProposeDogs?.length) {
            const proposeDogs = filteredProposeDogs?.map(dog => <option value={dog?.id} key={dog?.id}>{dog?.name}</option>)

            proposeDogContent = proposeDogs?.length
                ? <>
                    <p><b>Transfer Dog to {user?.username}</b></p>
                    <select value={selectedProposeDog} onChange={(e) => setSelectedProposeDog(e.target.value)}>
                        <option value="">--</option>
                        {proposeDogs}
                    </select>
                    <br />
                    <br />
                    <button
                        className="black-button"
                        disabled={!selectedProposeDog?.length}
                        style={!selectedProposeDog?.length ? {backgroundColor: "grey", cursor: "default"} : null}
                        onClick={handleProposeDog}
                    >
                        Propose Transfer
                    </button>
                    <br />
                    <br />
                </>
                : null
        }

        if (myProposals?.length) {
            const acceptDogs = myProposals?.map(dog => <option value={dog?.id} key={dog?.id}>{dog?.name}</option>)

            myProposalsContent = acceptDogs?.length 
                ? <>
                    <p><b>Accept Dog{myProposals?.length > 1 ? 's' : null} Offered by {user?.username}</b></p>
                    <select value={selectedAcceptDog} onChange={(e) => setSelectedAcceptDog(e.target.value)}>
                        <option value="">--</option>
                        {acceptDogs}
                    </select>
                    <br />
                    <br />
                    <button
                        className="black-button"
                        disabled={!selectedAcceptDog?.length}
                        style={!selectedAcceptDog?.length ? {backgroundColor: "grey", cursor: "default"} : null}
                        onClick={handleAcceptDog}
                    >
                        Accept Dog
                    </button>
                    <br />
                    <br />
                </>
                : null
        }
      
        dogContent = <>
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
            <br />
        </>
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
        await updateUser({ id: user?.id, active: false })
    }

    const handleUnbanUser = async () => {
        await updateUser({ id: user?.id, active: true })
    }

    const content = (
        <>
            <p className="user-page-username">
                {user?.username}
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
            <p><b>{user?.name}</b></p>
            <br />
            <p><b>From </b>{user?.region && user?.region !== 'none ' ? `${user?.region}, ` : null}{user?.country}</p>
            <br />
            {user?.bio?.length ? <><p><b>Bio</b></p><p>{user.bio}</p><br /></> : null}
            {filteredDogs?.length ? <><p><b>Dogs Administered</b></p><br />{dogContent}<br /></> : null}
            {proposeDogContent}
            {myProposalsContent}
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

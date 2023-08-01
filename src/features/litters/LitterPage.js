import { useGetLittersQuery, useUpdateLitterMutation, useDeleteLitterMutation } from "./littersApiSlice"
import { useGetDogsQuery, useUpdateDogMutation } from "../dogs/dogsApiSlice"
import { useNavigate, useParams, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import LitterDog from '../dogs/LitterDog'
import { useState, useEffect } from "react"

const LitterPage = () => {

    // PATCH function to update a dog when added to THE litter
    const [updateDog, {
        isUpdateLoading,
        isUpdateSuccess,
        isUpdateError,
        updateError
    }] = useUpdateDogMutation()

    // DELETE function for THE litter
    const [deleteLitter, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteLitterMutation()

    // PATCH function to add a father to the litter
    const [updateLitter, {
        isLoading: isLitterLoading,
        isSuccess: isLitterSuccess,
        isError: isLitterError,
        error: litterError
    }] = useUpdateLitterMutation()

    const [selectedDog, setSelectedDog] = useState('')
    const [selectedFather, setSelectedFather] = useState('')

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { litterid } = useParams()

    // GET the litter with all of it's .values
    const { litter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            litter: data?.entities[litterid]
        }),
    })

    // GET the dog that's the mother of THE litter
    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            mother: data?.entities[litter?.mother?.toString()]
        }),
    })

    // GET the dog that's the father of THE litter
    const { father } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            father: data?.entities[litter?.father?.toString()]
        }),
    })

    // GET all the dogs
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

    // Go to litters page if THE litter has been deleted successfully
    useEffect(() => {
        if (isDelSuccess) {
            navigate('/litters')
        }
    }, [isDelSuccess, navigate])
    
    let dogContent
    let optionsContent
    let fatherOptionsContent
    let filteredDogs
    let filteredUserDogs
    
    if (isLoading || isUpdateLoading) dogContent = <p>Loading...</p>
    
    if (isError) {
        dogContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {

        const { ids, entities } = dogs

        let filteredFathers

        // Filter all the IDs of dogs whose litter is THE litter
        const filteredIds = ids.filter(dogId => entities[dogId].litter === litter?.id)
        
        // Filter all the IDs of dogs whose administrative user is the logged in user
        // AND is neither the mother or the father of THE litter
        // AND either matches the breed or is 'Mixed breed' if the parents of THE litter are different breeds
        // AND is not already added to this litter
        // These dogs are the ones the logged in user is able to add to the litter
        const filteredUserIds = ids.filter(dogId => entities[dogId].user === userId 
            && entities[dogId].id !== mother?.id
            && entities[dogId].id !== father?.id
            && ((mother?.breed === father?.breed 
                    && mother?.breed === entities[dogId].breed) 
                || (entities[dogId].breed === 'Mixed breed' 
                    && (mother?.breed !== father?.breed 
                        || (father?.breed === entities[dogId].breed 
                            && mother?.breed === entities[dogId].breed))))
            && !filteredIds.includes(entities[dogId].id))


        // Filter the dogs whose administrative user is the logged in user
        // AND is neither the father or the mother of the litter
        // AND is not already added to the litter
        // AND is a male dog
        // These are the dogs that the user is able to add as the father of the litter
        const filteredFatherIds = ids.filter(dogId => entities[dogId].user === userId 
            && entities[dogId].id !== mother?.id
            && entities[dogId].id !== father?.id
            && entities[dogId].female === false
            && !filteredIds.includes(entities[dogId].id))

        // Convert IDs to objects with .values
        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        if (filteredFatherIds?.length) {
            filteredFathers = filteredFatherIds.map(dogId => entities[dogId])
        }

        if (filteredUserIds?.length) {
            filteredUserDogs = filteredUserIds.map(dogId => entities[dogId])
        }

        // Variable to store the LitterDog component for each dog belonging to the litter
        let tableContent

        if (filteredDogs?.length) {
            tableContent = filteredDogs.map(dog => (
               <LitterDog key={dog.id} dogId={dog.id} />
            ))
        }

        // List of <option>s for each dog the user is able to add to the litter
        if (filteredUserDogs?.length) {
            optionsContent = filteredUserDogs.map(dog => (
               <option value={dog.id} key={dog.id}>{dog.name}</option>
            ))
        }

        // List of <option>s for each dog the user is able to add as the father of the litter
        if (filteredFathers?.length) {
            fatherOptionsContent = filteredFathers.map(dog => (
               <option value={dog.id} key={dog.id}>{dog.name}</option>
            ))
        }

      
        dogContent = (
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Good</th>
                        <th>Administered by</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    if (!litter) {
        return null
    }

    if (!mother) {
        return null
    }

    let content = null

    // DELETE THE litter
    async function handleDeleteLitter() {
        await deleteLitter({ id: litterid })
    }

    // Option to DELETE the litter only for the user that is the administrative user of the litter's mother dog
    if (mother?.user === userId) {
        content = (
            <>
                <button
                    className="black-button"
                    onClick={() => handleDeleteLitter()}
                >
                    Delete
                </button>
                <br />
                <br />
            </>
        )
    }


    // Add litter to the user's dog
    async function addToLitter() {
        await updateDog({ "id": selectedDog, "litter": litterid })
    }

    // Add father dog to the litter
    async function addFatherToLitter() {
        return updateLitter({ "id": litterid, "father": selectedFather })
    }

    // Boolean to control the style and 'disabled' value of the ADD FATHER button
    const canSaveFather = selectedFather?.length && !isLoading
    const fatherButtonStyle = !canSaveFather ? {backgroundColor: "grey"} : null
    

    const fatherContent = father?.id?.length 
        ? null
        : <><p><b>Add father to litter</b></p>
                <select value={selectedFather} onChange={(e) => setSelectedFather(e.target.value)}>
                    <option value="">Pick your dog</option>
                    {fatherOptionsContent}
                </select>
                <br />
                <br />
                <button
                    className="black-button"
                    style={fatherButtonStyle}
                    disabled={!canSaveFather}
                    onClick={() => addFatherToLitter()}
                >
                    Add Father
                </button>
                <br />
                <br />
                <br />
            </>

    const addPuppyContent = filteredUserDogs?.length && (litter?.children > filteredDogs?.length || !filteredDogs?.length)
        ? <><p><b>Add dog to litter</b></p>
            <select value={selectedDog} onChange={(e) => setSelectedDog(e.target.value)}>
                <option value="">Pick your dog</option>
                {optionsContent}
            </select>
            <br />
            <br />
            <button
                className="black-button"
                disabled={selectedDog?.length ? false : true}
                style={selectedDog?.length ? null : {backgroundColor: "grey"}}
                onClick={() => addToLitter()}
            >
                Add Dog
            </button>
            <br />
            <br />
            </>
        : null

    return (
        <>
            {content}
            <p><b>Mother </b><Link className="orange-link" to={`/dogs/${mother.id}`}><b>{mother?.name} </b></Link>({mother?.breed})</p>
            <p>
                <b>Father </b> 
                {father?.id?.length 
                    ? <><Link className="orange-link" to={`/dogs/${father?.id}`}><b>{father?.name} </b></Link>({father?.breed})</>
                    : 'Not Added'}
            </p>
            <p><b>Born </b>{litter?.born?.split(' ').slice(1, 4).join(' ')}</p>
            <p><b>{litter?.children} Puppies</b></p>
            <br />
            {fatherContent}
            {addPuppyContent}
            <p><b>Puppies</b></p>
            <br />
            {dogContent}
        </>
    )
}

export default LitterPage

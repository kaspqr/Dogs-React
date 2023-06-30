import { useGetLittersQuery, useUpdateLitterMutation, useDeleteLitterMutation } from "./littersApiSlice"
import { useGetDogsQuery, useUpdateDogMutation } from "../dogs/dogsApiSlice"

import { useNavigate, useParams, Link } from "react-router-dom"

import useAuth from "../../hooks/useAuth"

import LitterDog from '../dogs/LitterDog'

import { useState, useEffect } from "react"

const LitterPage = () => {

    const [updateDog, {
        isUpdateLoading,
        isUpdateSuccess,
        isUpdateError,
        updateError
    }] = useUpdateDogMutation()

    const [deleteLitter, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteLitterMutation()

    const [updateLitter, {
        isLoading: isLitterLoading,
        isSuccess: isLitterSuccess,
        isError: isLitterError,
        error: litterError
    }] = useUpdateLitterMutation()

    const [selectedDog, setSelectedDog] = useState()
    const [selectedFather, setSelectedFather] = useState('')

    const navigate = useNavigate()

    const { userId } = useAuth()

    const { litterid } = useParams()


    const { litter } = useGetLittersQuery("littersList", {
        selectFromResult: ({ data }) => ({
            litter: data?.entities[litterid]
        }),
    })


    const { mother } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            mother: data?.entities[litter?.mother?.toString()]
        }),
    })


    const { father } = useGetDogsQuery("dogsList", {
        selectFromResult: ({ data }) => ({
            father: data?.entities[litter?.father?.toString()]
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
    
    if (isError || isUpdateError) {
        dogContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids, entities } = dogs

        let filteredFathers

        const filteredIds = ids.filter(dogId => entities[dogId].litter === litter?.id)
        
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

        const filteredFatherIds = ids.filter(dogId => entities[dogId].user === userId 
            && entities[dogId].id !== mother?.id
            && entities[dogId].id !== father?.id
            && entities[dogId].female === false
            && !filteredIds.includes(entities[dogId].id))

        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        if (filteredFatherIds?.length) {
            filteredFathers = filteredFatherIds.map(dogId => entities[dogId])
        }

        if (filteredUserIds?.length) {
            filteredUserDogs = filteredUserIds.map(dogId => entities[dogId])
        }

        let tableContent

        if (filteredDogs?.length) {
            tableContent = filteredDogs.map(dog => (
               <LitterDog key={dog.id} dogId={dog.id} />
            ))
        }

        if (filteredUserDogs?.length) {
            optionsContent = filteredUserDogs.map(dog => (
               <option value={dog.id} key={dog.id}>{dog.name}, {dog.id}</option>
            ))
        }

        if (filteredFathers?.length) {
            fatherOptionsContent = filteredFathers.map(dog => (
               <option value={dog.id} key={dog.id}>{dog.name}, {dog.id}</option>
            ))
        }

        console.log(filteredFathers)
        console.log(filteredFatherIds)
      
        dogContent = (
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Administered By</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    if (!litter) {
        console.log(litter)
        return null
    }

    if (!mother) {
        console.log(litter.mother)
        return null
    }

    let content = null

    async function handleDeleteLitter() {
        await deleteLitter({ id: litterid })
    }

    if (mother?.user === userId) {
        content = (
            <>
                <button
                    onClick={() => handleDeleteLitter()}
                >
                    Delete
                </button>
                <br />
                <br />
            </>
        )
    }


    async function addToLitter() {
        console.log('selected dog was: ' + selectedDog)
        console.log('selected litter was: ' + litterid)
        await updateDog({ "id": selectedDog, "litter": litterid })
    }


    async function addFatherToLitter() {
        return updateLitter({ "id": litterid, "father": selectedFather })
    }

    const canSaveFather = selectedFather?.length && !isLoading
    const fatherButtonStyle = !canSaveFather ? {backgroundColor: "grey"} : null

    console.log(selectedFather)
    console.log(selectedFather?.length)

    const fatherContent = father?.id?.length 
        ? null
        : <><p><b>Add father to litter:</b></p>
                <select value={selectedFather} onChange={(e) => setSelectedFather(e.target.value)}>
                    <option value="">Pick your dog</option>
                    {fatherOptionsContent}
                </select>
                <br />
                <br />
                <button
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
        ? <><p><b>Add dog to litter:</b></p>
            <select value={selectedDog} onChange={(e) => setSelectedDog(e.target.value)}>
                <option value="">Pick your dog</option>
                {optionsContent}
            </select>
            <br />
            <br />
            <button
                disabled={selectedDog?.length ? false : true}
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
            <p><b>Mother:</b> <Link to={`/dogs/${mother.id}`}>{mother?.name}</Link>, {mother?.breed}</p>
            <p>
                <b>Father: </b> 
                {father?.id?.length 
                    ? <><Link to={`/dogs/${father?.id}`}>{father?.name}</Link>, {father?.breed}</>
                    : 'Not added'}
            </p>
            <p><b>Born:</b> {litter?.born?.split(' ').slice(1, 4).join(' ')}</p>
            <p><b>Number of puppies: </b>{litter?.children}</p>
            <br />
            {fatherContent}
            {addPuppyContent}
            <p><b>Dogs:</b></p>
            <br />
            {dogContent}
        </>
    )
}

export default LitterPage

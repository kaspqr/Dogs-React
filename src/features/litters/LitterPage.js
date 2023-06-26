import { useGetLittersQuery } from "./littersApiSlice"
import { useGetDogsQuery, useUpdateDogMutation } from "../dogs/dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"

import { useNavigate, useParams, Link } from "react-router-dom"

import useAuth from "../../hooks/useAuth"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

import Dog from '../dogs/Dog'

import { useState } from "react"

const LitterPage = () => {

    const [updateDog, {
        isUpdateLoading,
        isUpdateSuccess,
        isUpdateError,
        updateError
    }] = useUpdateDogMutation()


    const [selectedDog, setSelectedDog] = useState()

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
    
    let dogContent
    let optionsContent
    
    if (isLoading) dogContent = <p>Loading...</p>
    
    if (isError) {
        dogContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {
        const { ids, entities } = dogs

        let filteredDogs
        let filteredUserDogs

        const filteredIds = ids.filter(dogId => entities[dogId].litter === litter.id)
        const filteredUserIds = ids.filter(dogId => entities[dogId].user === userId 
            && entities[dogId].id !== mother.id
            && entities[dogId].id !== father.id
            && !filteredIds.includes(entities[dogId].id))

        if (filteredIds?.length) {
            filteredDogs = filteredIds.map(dogId => entities[dogId])
        }

        if (filteredUserIds?.length) {
            filteredUserDogs = filteredUserIds.map(dogId => entities[dogId])
        }

        let tableContent

        if (filteredDogs?.length) {
            tableContent = filteredDogs.map(dog => (
               <Dog key={dog.id} dogId={dog.id} />
            ))
        }

        if (filteredUserDogs?.length) {
            optionsContent = filteredUserDogs.map(dog => (
               <option value={dog.id} key={dog.id}>{dog.name}, {dog.id}</option>
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
                        <th>Administrative User</th>
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


    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[mother?.user]
        }),
    })

    if (!litter) {
        console.log(litter)
        return null
    }

    if (!mother) {
        console.log(litter.mother)
        return null
    }

    if (!father) {
        console.log('no father')
        return null
    }

    let content = null

    if (user === userId) {
        content = (
            <button
                onClick={() => navigate(`/litters/edit/${litter.id}`)}
            >
                <FontAwesomeIcon icon={faSave} />
            </button>
        )
    }


    async function addToLitter() {
        console.log('selected dog was: ' + selectedDog)
        console.log('selected litter was: ' + litterid)
        await updateDog({ "id": selectedDog, "litter": litterid })
    }

    return (
        <>
            {content}
            <p>Mother: <Link to={`/dogs/${mother.id}`}>{mother.name}</Link>, ID {mother.id}</p>
            <p>Father: <Link to={`/dogs/${father.id}`}>{father.name}</Link>, ID {father.id}</p>
            <p>Litter ID: {litter.id}</p>
            <p>Born: {litter?.born}</p>
            <br />
            <p>Add dog to litter:</p>
            <select value={selectedDog} onChange={(e) => setSelectedDog(e.target.value)}>
                <option value="">Pick your dog</option>
                {optionsContent}
            </select>
            <button
                disabled={selectedDog?.length ? false : true}
                onClick={() => addToLitter()}
            >
                Add
            </button>
            <br />
            <p>Dogs:</p>
            {dogContent}
        </>
    )
}

export default LitterPage

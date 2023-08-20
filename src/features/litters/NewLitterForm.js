import { useState, useEffect } from "react"
import { useAddNewLitterMutation } from "./littersApiSlice"
import { useNavigate } from "react-router-dom"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import useAuth from "../../hooks/useAuth"
import Calendar from "react-calendar"
import '../../styles/customCalendar.css'

const NewLitterForm = () => {

    const { userId } = useAuth()

    const PUPPIES_REGEX = /^[1-9]\d{0,1}$/

    const navigate = useNavigate()

    const [mother, setMother] = useState('')
    const [born, setBorn] = useState('')
    const [breed, setBreed] = useState('')
    const [children, setChildren] = useState('')
    const [validMother, setValidMother] = useState(false)
    const [breedOptions, setBreedOptions] = useState(null)

    // POST function for adding a new litter
    const [addNewLitter, {
        isLoading: isLitterLoading,
        isSuccess: isLitterSuccess,
        isError: isLitterError,
        error: litterError
    }] = useAddNewLitterMutation()

    // Clear the inputs if the litter has been successfully posted
    useEffect(() => {
        if (isLitterSuccess) {
            setBorn('')
            setMother('')
            setChildren('')
        }
    }, [isLitterSuccess, navigate])

    useEffect(() => {
        if (mother?.length) {
            setValidMother(true)
        } else {
            setValidMother(false)
        }
    }, [mother])

    const handleBornChanged = date => setBorn(date)
    const handleMotherChanged = e => {

        setBreed('')

        const { ids, entities } = dogs

        // Filter the mother's ID
        const motherId = ids.find(dogId => entities[dogId].id === e.target.value)

        // And get it's .values
        const mother = entities[motherId]

        if (mother?.breed === 'Mixed breed') {
            setBreedOptions(<option key='Mixed breed' value='Mixed breed'>Mixed breed</option>)
        } else {
            setBreedOptions(<>
                <option key='Mixed breed' value='Mixed breed'>Mixed breed</option>
                <option key={mother?.breed} value={mother?.breed}>{mother?.breed}</option>
            </>)
        }
        
        setMother(e.target.value)
    }

    const handleSaveLitterClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            // Format the date
            let finalBorn = born !== '' ? new Date(born.getTime()).toDateString() : ''
            // POST the litter
            await addNewLitter({ mother, born: finalBorn, children, breed })
            navigate('/litters')
        }

        if (isLitterError) {
            console.log(litterError)
        }
    }

    // GET all the dogs
    const {
        data: dogs,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetDogsQuery('dogsList', {
        pollingInterval: 75000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let dogsContent
    let ownedDogs
    
    if (isLoading || isLitterLoading) {
        dogsContent = <p>Loading...</p>
    }
    
    if (isError) {
        dogsContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {

        const { ids, entities } = dogs

        // Filter all the female dog IDs who are administrated by the logged in user
        const filteredIds = ids.filter(dogId => entities[dogId].user === userId && entities[dogId].female === true)
        // And get their .values
        const filteredDogs = filteredIds.map(dogId => entities[dogId])

        if (!filteredIds.length) return <p>You have no female dogs.</p>

        // Create an <option>s list for each female dog administrated by the logged in user
        if (filteredDogs?.length) {
            ownedDogs = filteredDogs.map(dog => (
                <option
                    key={dog.id}
                    value={dog.id}
                >
                    {dog.name}
                </option>
            ))
        }
    }

    // Boolean to control the style and 'disabled' value of the SAVE button
    const canSave = validMother && born !== '' && !isLoading && children > 0 && children < 31 && breed !== '' && new Date(born) >= new Date(dogs?.entities[mother]?.birth)

    if (!dogs) return null

    const saveColor = !canSave ? {backgroundColor: "grey"} : null

    const content = (
        <>
            <p>{dogsContent}</p>

            <form onSubmit={handleSaveLitterClicked}>
                <p className="register-litter-page-title">Register Litter</p>
                <br />
                
                <label htmlFor="litter">
                    <b>Litter's Mother</b>
                </label>
                <br />
                <select 
                    type="text" 
                    id="mother"
                    name="mother"
                    value={mother}
                    onChange={handleMotherChanged}
                >
                    <option
                        id="none"
                        name="none"
                        value=""
                        disabled={true}
                    >
                        Select dog
                    </option>
                    {ownedDogs}
                </select>
                <br />

                <label htmlFor="breed">
                    <b>Puppies' Breed</b>
                </label>
                <br />
                <select 
                    type="text" 
                    id="breed"
                    name="breed"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                >
                    <option value="" disabled={true}>Breed</option>
                    {breedOptions}
                </select>

                <br />

                <label htmlFor="puppies">
                    <b>Amount of Puppies Born</b>
                </label>
                <br />
                <input 
                    value={children}
                    onChange={(e) => {
                        if (PUPPIES_REGEX.test(e.target.value) || e.target.value === '') {
                            setChildren(e.target.value)
                        }
                    }}
                    type="text" 
                    name="puppies"
                    id="puppies"
                    maxLength="2"
                />

                <br />
                <br />

                <label htmlFor="born">
                    <b>Born</b>
                </label>
                <br />
                <Calendar minDate={mother?.length ? new Date(dogs?.entities[mother]?.birth) : null} maxDate={new Date()} onChange={handleBornChanged} value={born} />
                <br />
                
                <button
                    className="black-button"
                    style={saveColor}
                    title="Save"
                    disabled={!canSave}
                >
                    Save
                </button>
            </form>
        </>
    )

  return content
}

export default NewLitterForm

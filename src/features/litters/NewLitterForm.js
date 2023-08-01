import { useState, useEffect } from "react"
import { useAddNewLitterMutation } from "./littersApiSlice"
import { useNavigate } from "react-router-dom"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import useAuth from "../../hooks/useAuth"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

const NewLitterForm = () => {

    const { userId } = useAuth()

    // POST function for adding a new litter
    const [addNewLitter, {
        isLoading: isLitterLoading,
        isSuccess: isLitterSuccess,
        isError: isLitterError,
        error: litterError
    }] = useAddNewLitterMutation()


    const navigate = useNavigate()

    const [mother, setMother] = useState('')

    const [born, setBorn] = useState('')

    const [children, setChildren] = useState()

    const [validMother, setValidMother] = useState(false)

    // Clear the inputs if the litter has been successfully posted
    useEffect(() => {
        if (isLitterSuccess) {
            setBorn('')
            setMother('')
            setChildren('')
        }
    }, [isLitterSuccess, navigate])

    useEffect(() => {
        if (mother.length) {
            setValidMother(true)
        } else {
            setValidMother(false)
        }
    }, [mother])

    const handleBornChanged = date => setBorn(date)
    const handleMotherChanged = e => setMother(e.target.value)

    const handleSaveLitterClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            // Format the date
            let finalBorn = born !== '' ? new Date(born.getTime()).toDateString() : ''
            // POST the litter
            await addNewLitter({ mother, born: finalBorn, children })
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
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    
    let dogsContent
    let ownedDogs
    
    if (isLoading) {
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
                    key={dog}
                    value={dog.id}
                >
                    {dog.name}
                </option>
            ))
        }
    }

    // Boolean to control the style and 'disabled' value of the SAVE button
    const canSave = validMother && born !== '' && !isLoading && children > 0

    if (!dogs) return null

    const saveColor = !canSave ? {backgroundColor: "grey"} : null

    const content = (
        <>
            <p>{dogsContent}</p>

            <form onSubmit={handleSaveLitterClicked}>
                <div>
                    <p className="register-litter-page-title">Register Litter</p>
                    <br />
                    <div>
                        <button
                            className="black-button"
                            style={saveColor}
                            title="Save"
                            disabled={!canSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <br />
                
                <label htmlFor="litter">
                    <b>Litter's mother:</b>
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
                <br />

                <label htmlFor="born">
                    <b>Born</b>
                </label>
                <br />
                <Calendar maxDate={new Date()} onChange={handleBornChanged} value={born} />
                <br />
                <br />

                <label htmlFor="puppies">
                    <b>Amount of puppies born:</b>
                </label>
                <br />
                <input 
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    type="number" 
                    name="puppies"
                    id="puppies"
                    min="1"
                    max="30"
                />
                
            </form>
        </>
    )

  return content
}

export default NewLitterForm

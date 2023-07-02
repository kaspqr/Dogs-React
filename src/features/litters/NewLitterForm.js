import { useState, useEffect } from "react"
import { useAddNewLitterMutation } from "./littersApiSlice"
import { useNavigate } from "react-router-dom"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import useAuth from "../../hooks/useAuth"

const NewLitterForm = () => {

    const { userId } = useAuth()

    const [addNewLitter, {
        isLoading: isLitterLoading,
        isSuccess: isLitterSuccess,
        isError: isLitterError,
        error: litterError
    }] = useAddNewLitterMutation()


    const navigate = useNavigate()

    const [mother, setMother] = useState('')

    const [born, setBorn] = useState('')

    const [validMother, setValidMother] = useState(false)

    useEffect(() => {
        if (isLitterSuccess) {
            setBorn('')
            setMother('')
        }
    }, [isLitterSuccess, navigate])

    useEffect(() => {
        if (mother.length) {
            setValidMother(true)
        } else {
            setValidMother(false)
        }
    }, [mother])

    const handleBornChanged = e => setBorn(e.target.value)
    const handleMotherChanged = e => setMother(e.target.value)

    const handleSaveLitterClicked = async (e) => {
        e.preventDefault()
        console.log(canSave)
        console.log(mother)
        console.log(born)
        if (canSave) {
            await addNewLitter({ mother, born })
        }

        if (isLitterError) {
            console.log(litterError)
        }
    }


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
        console.log('loading dogs')
    }
    
    if (isError) {
        console.log('isDogsError')
        dogsContent = <p className="errmsg">{error?.data?.message}</p>
    }
    
    if (isSuccess) {

        const { ids, entities } = dogs

        const filteredIds = ids.filter(dogId => entities[dogId].user === userId && entities[dogId].female === true)
        const filteredDogs = filteredIds.map(dogId => entities[dogId])

        if (!filteredIds.length) return <p>You have no dogs.</p>

        if (filteredDogs?.length) {
            ownedDogs = filteredDogs.map(dog => (
                <option
                    key={dog}
                    value={dog.id}
                >
                    {dog.name} {dog.id}
                </option>
            ))
        }
    }

    const canSave = validMother && !isLoading

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
                    <b>Born:</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="born"
                    name="born"
                    value={born}
                    onChange={handleBornChanged}
                />

                
            </form>
        </>
    )

  return content
}

export default NewLitterForm

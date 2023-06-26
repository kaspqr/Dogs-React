import { useState, useEffect } from "react"
import { useAddNewLitterMutation } from "./littersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import useAuth from "../../hooks/useAuth"

const NewLitterForm = () => {

    const { userId } = useAuth()

    const [addNewLitter, {
        isLitterLoading,
        isLitterSuccess,
        isLitterError,
        litterError
    }] = useAddNewLitterMutation()


    const navigate = useNavigate()

    const [mother, setMother] = useState('')

    const [born, setBorn] = useState('')

    const [validBorn, setValidBorn] = useState(false)

    const [validMother, setValidMother] = useState(false)

    useEffect(() => {
        if (isLitterSuccess) {
            setBorn('')
            setMother('')
        }
    }, [isLitterSuccess, navigate])

    useEffect(() => {
        if (born.length) {
            setValidBorn(true)
        } else {
            setValidBorn(false)
        }
    }, [born])

    useEffect(() => {
        if (mother.length) {
            setValidMother(true)
        } else {
            setValidMother(false)
        }
    }, [mother])

    const canSave = validMother && validBorn && !isLitterLoading

    const handleBornChanged = e => setBorn(e.target.value)
    const handleMotherChanged = e => setMother(e.target.value)

    const handleSaveLitterClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewLitter({ mother, born })
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

    if (!dogs) return null

    const content = (
        <>
            <p>{dogsContent}</p>

            <form onSubmit={handleSaveLitterClicked}>
                <div>
                    <h2>Register Litter</h2>
                    <div>
                        <button
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                
                <label htmlFor="litter">
                    Litter's mother:
                </label>
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

                <label htmlFor="born">
                    Born:
                </label>
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

import { useState, useEffect } from "react"
import { useUpdateDogMutation, useDeleteDogMutation } from "./dogsApiSlice"
import { useNavigate } from "react-router-dom"

const NAME_REGEX = /^[A-z]{2,20}$/
const INFO_REGEX = /^[A-z0-9,.!?]{3,200}$/


const EditDogForm = ({ dog }) => {

    const [updateDog, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateDogMutation()

    const [deleteDog, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteDogMutation()


    const navigate = useNavigate()


    const [name, setName] = useState(dog?.name?.length ? dog.name : '')
    const [validName, setValidName] = useState(false)

    const [owner, setOwner] = useState(dog?.owner?.length ? dog.owner : '')

    const [heat, setHeat] = useState(typeof dog?.heat === 'boolean' ? dog.heat : false)

    const [sterilized, setSterilized] = useState(dog?.sterilized)

    const [birth, setBirth] = useState(dog?.birth?.length ? dog.birth : '')

    const [death, setDeath] = useState(dog?.death?.length ? dog.death : '')

    const [microchipped, setMicrochipped] = useState(typeof dog?.microchipped === 'boolean' ? dog.microchipped : false)

    const [chipnumber, setChipnumber] = useState(dog?.chipnumber?.length ? dog.chipnumber : '')

    const [passport, setPassport] = useState(typeof dog?.passport === 'boolean' ? dog.passport : false)

    const [info, setInfo] = useState(dog?.info?.length ? dog.info : '')
    const [validInfo, setValidInfo] = useState(false)

    const [location, setLocation] = useState(dog?.location?.length ? dog.location : '')

    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
    }, [name])

    useEffect(() => {
        setValidInfo(INFO_REGEX.test(info))
    }, [info])


    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            navigate('/dogs')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const handleNameChanged = e => setName(e.target.value)
    const handleLocationChanged = e => setLocation(e.target.value)
    const handleOwnerChanged = e => setOwner(e.target.value)
    const handleBirthChanged = e => setBirth(e.target.value)
    const handleDeathChanged = e => setDeath(e.target.value)
    const handleChipnumberChanged = e => setChipnumber(e.target.value)
    const handleInfoChanged = e => setInfo(e.target.value)

    const handleHeatChanged = () => setHeat(prev => !prev)
    const handleSterilizedChanged = () => setSterilized(prev => !prev)
    const handleMicrochippedChanged = () => setMicrochipped(prev => !prev)
    const handlePassportChanged = () => setPassport(prev => !prev)

    const handleSaveDogClicked = async () => {
        await updateDog({ id: dog.id, name, location, owner, birth, death, sterilized, passport, microchipped, chipnumber, info, heat })
    }

    const handleDeleteDogClicked = async () => {
        await deleteDog({ id: dog.id })
    }

    let canSave = [validName].every(Boolean) && !isLoading

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p>{errContent}</p>

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <h2>Edit Dog</h2>
                    <div>
                        <button
                            title="Save"
                            onClick={handleSaveDogClicked}
                            disabled={!canSave}
                        >
                            Save
                        </button>
                        <button
                            title="Delete"
                            onClick={handleDeleteDogClicked}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <label htmlFor="name">Name: [2-20 letters]</label>
                <br />
                <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleNameChanged}
                />
                <br />

                <label htmlFor="owner">
                    Owner:
                </label>
                <br />
                <input 
                    type="text" 
                    id="owner"
                    name="owner"
                    value={owner}
                    onChange={handleOwnerChanged}
                />
                <br />

                <label htmlFor="location">
                    Location:
                </label>
                <br />
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={location}
                    onChange={handleLocationChanged}
                />
                <br />

                <label htmlFor="birth">
                    Date of Birth:
                </label>
                <br />
                <input 
                    type="text" 
                    id="birth"
                    name="birth"
                    value={birth}
                    onChange={handleBirthChanged}
                />
                <br />

                <label htmlFor="death">
                    Date of Death:
                </label>
                <br />
                <input 
                    type="text" 
                    id="death"
                    name="death"
                    value={death}
                    onChange={handleDeathChanged}
                />
                <br />

                <label htmlFor="passport">
                    Passport:
                </label>
                <input 
                    type="checkbox" 
                    id="passport"
                    name="passport"
                    checked={passport}
                    onChange={handlePassportChanged}
                />
                <br />

                <label htmlFor="heat">
                    Heat:
                </label>
                <input 
                    type="checkbox" 
                    id="heat"
                    name="heat"
                    checked={heat}
                    onChange={handleHeatChanged}
                />
                <br />

                <label htmlFor="sterilized">
                    Sterilized:
                </label>
                <input 
                    type="checkbox" 
                    id="sterilized"
                    name="sterilized"
                    checked={sterilized}
                    onChange={handleSterilizedChanged}
                />
                <br />

                <label htmlFor="microchipped">
                    Microchipped:
                </label>
                <input 
                    type="checkbox" 
                    id="microchipped"
                    name="microchipped"
                    checked={microchipped}
                    onChange={handleMicrochippedChanged}
                />
                <br />

                <label htmlFor="chipnumber">
                    Chipnumber:
                </label>
                <br />
                <input 
                    type="text" 
                    id="chipnumber"
                    name="chipnumber"
                    value={chipnumber}
                    onChange={handleChipnumberChanged}
                />
                <br />

                <label htmlFor="info">
                    Info:
                </label>
                <br />
                <input 
                    type="text" 
                    id="info"
                    name="info"
                    value={info}
                    onChange={handleInfoChanged}
                />
            </form>
        </>
    )

  return content
}

export default EditDogForm


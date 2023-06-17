import { useState, useEffect } from "react"
import { useUpdateDogMutation, useDeleteDogMutation } from "./dogsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

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


    const [user, setUser] = useState(dog?.user?.length ? dog.user : '')

    const [name, setName] = useState(dog?.name?.length ? dog.name : '')
    const [validName, setValidName] = useState(false)

    const [owner, setOwner] = useState(dog?.owner?.length ? dog.owner : '')

    const [mother, setMother] = useState(dog?.mother?.length ? dog.mother : '')

    const [father, setFather] = useState(dog?.father?.length ? dog.father : '')

    const [litter, setLitter] = useState(dog?.litter?.length ? dog.litter : '')

    const [heat, setHeat] = useState(typeof dog?.heat === 'boolean' ? dog.heat : false)

    const [sterilized, setSterilized] = useState(dog?.sterilized)

    const [birth, setBirth] = useState(dog?.birth?.length ? dog.birth : '')

    const [death, setDeath] = useState(dog?.death?.length ? dog.death : '')

    const [breed, setBreed] = useState(dog?.breed)

    const [microchipped, setMicrochipped] = useState(typeof dog?.microchipped === 'boolean' ? dog.microchipped : false)

    const [chipnumber, setChipnumber] = useState(dog?.chipnumber?.length ? dog.chipnumber : '')

    const [passport, setPassport] = useState(typeof dog?.passport === 'boolean' ? dog.passport : false)

    const [info, setInfo] = useState(dog?.info?.length ? dog.info : '')
    const [validInfo, setValidInfo] = useState(false)

    const [location, setLocation] = useState(dog?.location?.length ? dog.location : '')

    const [active, setActive] = useState(typeof dog?.active === 'boolean' ? dog.active : true)

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
    const handleUserChanged = e => setUser(e.target.value)
    const handleOwnerChanged = e => setOwner(e.target.value)
    const handleMotherChanged = e => setMother(e.target.value)
    const handleFatherChanged = e => setFather(e.target.value)
    const handleLitterChanged = e => setLitter(e.target.value)
    const handleBirthChanged = e => setBirth(e.target.value)
    const handleDeathChanged = e => setDeath(e.target.value)
    const handleBreedChanged = e => setBreed(e.target.value)
    const handleChipnumberChanged = e => setChipnumber(e.target.value)
    const handleInfoChanged = e => setInfo(e.target.value)

    const handleActiveChanged = () => setActive(prev => !prev)
    const handleHeatChanged = () => setHeat(prev => !prev)
    const handleSterilizedChanged = () => setSterilized(prev => !prev)
    const handleMicrochippedChanged = () => setMicrochipped(prev => !prev)
    const handlePassportChanged = () => setPassport(prev => !prev)

    const handleSaveDogClicked = async () => {
        await updateDog({ id: dog.id, name, location, active, user, owner, mother, father, birth, death, sterilized, passport, microchipped, chipnumber, info, breed, litter, heat })
    }

    const handleDeleteDogClicked = async () => {
        await deleteDog({ id: dog.id })
    }

    let canSave = [validName].every(Boolean) && !isLoading && breed.length

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
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            title="Delete"
                            onClick={handleDeleteDogClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label htmlFor="name">Name: [2-20 letters]</label>
                <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleNameChanged}
                />

                <label htmlFor="administrative-user">
                    Administrative User:
                </label>
                <input 
                    type="text" 
                    id="administrative-user"
                    name="administrative-user"
                    value={user}
                    onChange={handleUserChanged}
                />

                <label htmlFor="owner">
                    Owner:
                </label>
                <input 
                    type="text" 
                    id="owner"
                    name="owner"
                    value={owner}
                    onChange={handleOwnerChanged}
                />

                <label htmlFor="breed">
                    Breed:
                </label>
                <input 
                    type="text" 
                    id="breed"
                    name="breed"
                    value={breed}
                    onChange={handleBreedChanged}
                />

                <label htmlFor="location">
                    Location:
                </label>
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={location}
                    onChange={handleLocationChanged}
                />

                <label htmlFor="mother">
                    Mother:
                </label>
                <input 
                    type="text" 
                    id="mother"
                    name="mother"
                    value={mother}
                    onChange={handleMotherChanged}
                />

                <label htmlFor="father">
                    Father:
                </label>
                <input 
                    type="text" 
                    id="father"
                    name="father"
                    value={father}
                    onChange={handleFatherChanged}
                />

                <label htmlFor="litter">
                    Litter:
                </label>
                <input 
                    type="text" 
                    id="litter"
                    name="litter"
                    value={litter}
                    onChange={handleLitterChanged}
                />

                <label htmlFor="birth">
                    Birth:
                </label>
                <input 
                    type="text" 
                    id="birth"
                    name="birth"
                    value={birth}
                    onChange={handleBirthChanged}
                />

                <label htmlFor="death">
                    Death:
                </label>
                <input 
                    type="text" 
                    id="death"
                    name="death"
                    value={death}
                    onChange={handleDeathChanged}
                />

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

                <label htmlFor="chipnumber">
                    Chipnumber:
                </label>
                <input 
                    type="text" 
                    id="chipnumber"
                    name="chipnumber"
                    value={chipnumber}
                    onChange={handleChipnumberChanged}
                />

                <label htmlFor="info">
                    Info:
                </label>
                <input 
                    type="text" 
                    id="info"
                    name="info"
                    value={info}
                    onChange={handleInfoChanged}
                />

                <label htmlFor="dog-active">
                    Active:
                </label>
                <input 
                    type="checkbox"
                    checked={active} 
                    id="dog-active"
                    name="dog-active"
                    onChange={handleActiveChanged}
                />
            </form>
        </>
    )

  return content
}

export default EditDogForm


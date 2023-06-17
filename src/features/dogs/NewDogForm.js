import { useState, useEffect } from "react"
import { useAddNewDogMutation } from "./dogsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"

const NAME_REGEX = /^[A-z]{2,20}$/
const INFO_REGEX = /^[A-z0-9,.!?]{3,200}$/

const NewDogForm = () => {

    const [addNewDog, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewDogMutation()


    const navigate = useNavigate()


    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)

    const [owner, setOwner] = useState('')

    const [mother, setMother] = useState('')

    const [father, setFather] = useState('')

    const [litter, setLitter] = useState('')

    const [heat, setHeat] = useState(false)

    const [sterilized, setSterilized] = useState(false)

    const [birth, setBirth] = useState('')

    const [death, setDeath] = useState('')

    const [breed, setBreed] = useState('')

    const [female, setFemale] = useState(true)

    const [microchipped, setMicrochipped] = useState(false)

    const [chipnumber, setChipnumber] = useState('')

    const [passport, setPassport] = useState(false)

    const [info, setInfo] = useState('')
    const [validInfo, setValidInfo] = useState(false)

    const [location, setLocation] = useState('')

    const [user, setUser] = useState('')


    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
    }, [name])

    useEffect(() => {
        setValidInfo(INFO_REGEX.test(info))
    }, [info])

    useEffect(() => {
        if (isSuccess) {
            setName('')
            setOwner('')
            setMother('')
            setFather('')
            setSterilized(false)
            setHeat(false)
            setPassport(false)
            setMicrochipped(false)
            setChipnumber('')
            setLitter('')
            setBirth('')
            setDeath('')
            setBreed('')
            setInfo('')
            setLocation('')
            setFemale(true)
            setUser('')
            navigate('/dogs')
        }
    }, [isSuccess, navigate])


    const handleNameChanged = e => setName(e.target.value)
    const handleOwnerChanged = e => setOwner(e.target.value)
    const handleBreedChanged = e => setBreed(e.target.value)
    const handleMotherChanged = e => setMother(e.target.value)
    const handleFatherChanged = e => setFather(e.target.value)
    const handleSterilizedChanged = e => setSterilized(e.target.value)
    const handlePassportChanged = e => setPassport(e.target.value)
    const handleMicrochippedChanged = e => setMicrochipped(e.target.value)
    const handleChipnumberChanged = e => setChipnumber(e.target.value)
    const handleLocationChanged = e => setLocation(e.target.value)
    const handleHeatChanged = e => setHeat(e.target.value)
    const handleBirthChanged = e => setBirth(e.target.value)
    const handleDeathChanged = e => setDeath(e.target.value)
    const handleInfoChanged = e => setInfo(e.target.value)
    const handleLitterChanged = e => setLitter(e.target.value)
    const handleUserChanged = e => setUser(e.target.value)
    const handleFemaleChanged = e => setFemale(e.target.value === "female" ? true : false)

    const canSave = typeof validName === 'boolean' && !isLoading && breed.length

    const handleSaveDogClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewDog({ name, location, owner, breed, mother, father, heat, sterilized, passport, microchipped, chipnumber, birth, death, info, litter, female, user })
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={handleSaveDogClicked}>
                <div>
                    <h2>Register Dog</h2>
                    <div>
                        <button
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                
                <label htmlFor="dogname">
                    Dog's name: [2-20 letters]
                </label>
                <input 
                    type="text" 
                    id="dogname"
                    name="dogname"
                    autoComplete="off"
                    value={name}
                    onChange={handleNameChanged}
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

                <label htmlFor="isFemale">
                    Gender:
                </label>
                <select 
                    onChange={handleFemaleChanged}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>

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

                <label htmlFor="user">
                    User:
                </label>
                <input 
                    type="text" 
                    id="user"
                    name="user"
                    value={user}
                    onChange={handleUserChanged}
                />
            </form>
        </>
    )

  return content
}

export default NewDogForm

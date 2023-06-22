import { useState, useEffect } from "react"
import { useAddNewDogMutation } from "./dogsApiSlice"
import { useNavigate } from "react-router-dom"
import { Breeds } from "../../config/breeds"
import useAuth from "../../hooks/useAuth"

const NAME_REGEX = /^[A-z]{2,20}$/
const INFO_REGEX = /^[A-z0-9,.!?]{3,200}$/

const NewDogForm = () => {

    const { userId } = useAuth()

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


    const breeds = [ ...Object.values(Breeds) ]
    const breedOptions = breeds.map(breed => (
        <option key={breed} value={breed}>{breed}</option>
    ))


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
            setSterilized(false)
            setHeat(false)
            setPassport(false)
            setMicrochipped(false)
            setChipnumber('')
            setBirth('')
            setDeath('')
            setBreed('')
            setInfo('')
            setLocation('')
            setFemale(true)
            navigate('/dogs')
        }
    }, [isSuccess, navigate])


    const handleNameChanged = e => setName(e.target.value)
    const handleOwnerChanged = e => setOwner(e.target.value)
    const handleBreedChanged = e => setBreed(e.target.value)
    const handleSterilizedChanged = e => setSterilized(e.target.value)
    const handlePassportChanged = e => setPassport(e.target.value)
    const handleMicrochippedChanged = e => setMicrochipped(e.target.value)
    const handleChipnumberChanged = e => setChipnumber(e.target.value)
    const handleLocationChanged = e => setLocation(e.target.value)
    const handleHeatChanged = e => setHeat(e.target.value)
    const handleBirthChanged = e => setBirth(e.target.value)
    const handleDeathChanged = e => setDeath(e.target.value)
    const handleInfoChanged = e => setInfo(e.target.value)
    const handleFemaleChanged = e => setFemale(e.target.value === "female" ? true : false)

    const canSave = typeof validName === 'boolean' && !isLoading && breed.length

    const handleSaveDogClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewDog({ name, location, owner, breed, heat, sterilized, passport, microchipped, chipnumber, birth, death, info, female, "user": userId })
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
                            Save
                        </button>
                    </div>
                </div>
                
                <label htmlFor="dogname">
                    Dog's name: [2-20 letters]
                </label>
                <br />
                <input 
                    type="text" 
                    id="dogname"
                    name="dogname"
                    autoComplete="off"
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

                <label htmlFor="breed">
                    Breed:
                </label>
                <br />
                <select 
                    type="text" 
                    id="breed"
                    name="breed"
                    value={breed}
                    onChange={handleBreedChanged}
                >
                    <option value="" disabled={true}>Breed</option>
                    {breedOptions}
                </select>
                <br />

                <label htmlFor="isFemale">
                    Gender:
                </label>
                <br />
                <select 
                    onChange={handleFemaleChanged}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
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

                <label htmlFor="heat">
                    Heat:
                </label>
                <br />
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
                <br />
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
                <br />
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

                <label htmlFor="passport">
                    Passport:
                </label>
                <br />
                <input 
                    type="checkbox" 
                    id="passport"
                    name="passport"
                    checked={passport}
                    onChange={handlePassportChanged}
                />
                <br />

                <label htmlFor="birth">
                    Birth:
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
                    Death:
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

export default NewDogForm

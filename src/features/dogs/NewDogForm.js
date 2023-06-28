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

    const canSave = typeof validName === 'boolean' && validName === true && !isLoading && breed.length

    const handleSaveDogClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewDog({ name, location, owner, breed, heat, sterilized, passport, microchipped, chipnumber, birth, death, info, female, "user": userId })
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    const saveColor = !canSave ? {backgroundColor: "grey"} : null

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={handleSaveDogClicked}>
                <div>
                    <p className="register-dog-title">Register Dog</p>
                    <br />
                    <div>
                        <button
                            style={saveColor}
                            title="Save"
                            disabled={!canSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <br />
                
                <label htmlFor="dogname">
                    <b>Dog's name: [2-20 letters]</b>
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
                <br />

                <label htmlFor="owner">
                    <b>Owner:</b>
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
                <br />

                <label htmlFor="breed">
                    <b>Breed:</b>
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
                <br />

                <label htmlFor="isFemale">
                    <b>Gender:</b>
                </label>
                <br />
                <select 
                    onChange={handleFemaleChanged}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                <br />
                <br />

                <label htmlFor="location">
                    <b>Location:</b>
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
                <br />

                <label htmlFor="passport">
                    <b>Passport:</b>
                </label>
                <input 
                    className="checkbox-to-the-right"
                    type="checkbox" 
                    id="passport"
                    name="passport"
                    checked={passport}
                    onChange={handlePassportChanged}
                />
                <br />
                <br />

                <label htmlFor="heat">
                    <b>Heat:</b>
                </label>
                <input 
                    className="checkbox-to-the-right"
                    type="checkbox" 
                    id="heat"
                    name="heat"
                    checked={heat}
                    onChange={handleHeatChanged}
                />
                <br />
                <br />

                <label htmlFor="sterilized">
                    <b>Sterilized:</b>
                </label>
                <input 
                    className="checkbox-to-the-right"
                    type="checkbox" 
                    id="sterilized"
                    name="sterilized"
                    checked={sterilized}
                    onChange={handleSterilizedChanged}
                />
                <br />
                <br />

                <label htmlFor="microchipped">
                    <b>Microchipped:</b>
                </label>
                <input 
                    className="checkbox-to-the-right"
                    type="checkbox" 
                    id="microchipped"
                    name="microchipped"
                    checked={microchipped}
                    onChange={handleMicrochippedChanged}
                />
                <br />
                <br />

                <label htmlFor="chipnumber">
                    <b>Chipnumber:</b>
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
                <br />

                <label htmlFor="birth">
                    <b>Birth:</b>
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
                <br />

                <label htmlFor="death">
                    <b>Death:</b>
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
                <br />

                <label htmlFor="info">
                    <b>Info:</b>
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

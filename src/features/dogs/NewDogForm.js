import { useState, useEffect } from "react"
import { useAddNewDogMutation } from "./dogsApiSlice"
import { useNavigate } from "react-router-dom"
import { Breeds } from "../../config/breeds"
import useAuth from "../../hooks/useAuth"
import Calendar from "react-calendar"
import '../../styles/customCalendar.css'
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"

const NAME_REGEX = /^(?=.{1,30}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/

const NewDogForm = () => {

    const { userId } = useAuth()

    // POST function to add a new dog
    const [addNewDog, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewDogMutation()


    const navigate = useNavigate()


    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)

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

    const [country, setCountry] = useState('Argentina')

    const [region, setRegion] = useState('none ')


    const breeds = [ ...Object.values(Breeds) ]
    const breedOptions = breeds.map(breed => (
        <option key={breed} value={breed}>{breed}</option>
    ))


    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
    }, [name])

    // Reset all inputs once a dog has been POSTed
    useEffect(() => {
        if (isSuccess) {
            setName('')
            setSterilized(false)
            setHeat(false)
            setPassport(false)
            setMicrochipped(false)
            setChipnumber('')
            setBirth('')
            setDeath('')
            setBreed('')
            setInfo('')
            setCountry('')
            setRegion('none ')
            setFemale(true)
            navigate('/dogs')
        }
    }, [isSuccess, navigate])


    const handleNameChanged = e => setName(e.target.value)
    const handleBreedChanged = e => setBreed(e.target.value)
    const handleChipnumberChanged = e => setChipnumber(e.target.value)
    const handleBirthChanged = date => setBirth(date)
    const handleDeathChanged = date => setDeath(date)

    const handleHeatChanged = () => setHeat(prev => !prev)
    const handleSterilizedChanged = () => setSterilized(prev => !prev)
    const handlePassportChanged = () => setPassport(prev => !prev)
    const handleMicrochippedChanged = () => {
        setChipnumber('')
        setMicrochipped(prev => !prev)
    }

    const handleInfoChanged = e => setInfo(e.target.value)
    const handleFemaleChanged = e => {
        if (e.target.value === 'male') {
            setHeat(false)
        }
        setFemale(e.target.value === "female" ? true : false)
    }

    // Clear the region each time the country is changed in order to avoid having a region from the wrong country
    const handleCountryChanged = (e) => {
        setRegion('')
        setCountry(e.target.value)
    }

    // Boolean to control the style and 'disabled' value of the SAVE button
    const canSave = typeof validName === 'boolean' && validName === true 
        && !isLoading && breed.length && typeof birth === 'object' && birth !== '' 
        && ((typeof death === 'object' && death.getTime() >= birth.getTime()) || death === '')

    const handleSaveDogClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            // Format the date
            let finalBirth = birth !== '' ? new Date(birth.getTime()).toDateString() : ''
            let finalDeath = death !== '' ? new Date(death.getTime()).toDateString() : ''
            // POST the dog
            await addNewDog({ name, country, region, breed, heat, sterilized, passport, 
                microchipped, chipnumber, birth: finalBirth, death: finalDeath, info, female, "user": userId })
        }
    }

    const saveColor = !canSave ? {backgroundColor: "grey", cursor: "default"} : null

    const content = (
        <>
            <p>{error?.data?.message}</p>

            <form onSubmit={handleSaveDogClicked}>
                <div>
                    <p className="register-dog-title">Register Dog</p>
                </div>
                <br />
                <p>Fields marked with <b>*</b> are required</p>
                <br />
                
                <label htmlFor="dogname">
                    <b>Dog's name (2-20 letters)*</b>
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

                <label htmlFor="breed">
                    <b>Breed*</b>
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
                    <b>Gender*</b>
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

                <label htmlFor="country">
                    <b>Country*</b>
                </label>
                <br />
                <select 
                    name="country" 
                    id="country"
                    value={country}
                    onChange={handleCountryChanged}
                >
                    {Countries}
                </select>
                <br />
                <br />

                {bigCountries?.includes(country) 
                    ? <><label htmlFor="region">
                                <b>Region</b>
                            </label>
                            <br />
                            <select 
                                name="region" 
                                id="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            >
                                <option value="none ">Region (optional)</option>
                                {bigCountries?.includes(country) ? Regions[country] : null}
                            </select>
                            <br />
                            <br />
                        </>
                    : null
                }

                <label htmlFor="passport">
                    <b>Passport</b>
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

                {female === true 
                    ? <><label htmlFor="heat">
                        <b>Heat</b>
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
                        <br /></> 
                    : null
                }

                <label htmlFor="sterilized">
                    <b>Fixed</b>
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
                    <b>Microchipped</b>
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

                {microchipped === true 
                    ? <><label htmlFor="chipnumber">
                        <b>Chipnumber</b>
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
                        <br /></> 
                    : null
                }

                <label htmlFor="birth">
                    <b>Date of Birth*</b>
                </label>
                <br />
                <Calendar maxDate={death || new Date()} onChange={handleBirthChanged} value={birth} />
                <br />
                <br />

                <label htmlFor="death">
                    <b>Date of Death (if not alive)</b>
                </label>
                <br />
                <br />
                <button 
                    className="black-button"
                    style={death === '' ? {backgroundColor: "grey", cursor: "default"} : null}
                    disabled={death === ''}
                    onClick={() => setDeath('')}
                >
                    Clear date
                </button>
                <br />
                <br />
                <Calendar minDate={birth || null} maxDate={new Date()} onChange={handleDeathChanged} value={death} />
                <br />
                <br />

                <label htmlFor="info">
                    <b>Info</b>
                </label>
                <br />
                <textarea 
                    cols="30"
                    rows="10"
                    maxLength="255"
                    id="info"
                    name="info"
                    value={info}
                    onChange={handleInfoChanged}
                />
                <br />
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
            </form>
        </>
    )

  return content
}

export default NewDogForm

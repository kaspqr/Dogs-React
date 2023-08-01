import { useState, useEffect } from "react"
import { useUpdateDogMutation, useDeleteDogMutation } from "./dogsApiSlice"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"

const EditDogForm = ({ dog }) => {

    // PATCH function for updating THE dog
    const [updateDog, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateDogMutation()

    // DELETE function for THE dog
    const [deleteDog, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteDogMutation()


    const navigate = useNavigate()


    const [heat, setHeat] = useState(typeof dog?.heat === 'boolean' ? dog.heat : false)

    const [sterilized, setSterilized] = useState(dog?.sterilized)

    const [death, setDeath] = useState(dog?.death?.length ? dog.death : '')

    const [microchipped, setMicrochipped] = useState(typeof dog?.microchipped === 'boolean' ? dog.microchipped : false)

    const [chipnumber, setChipnumber] = useState(dog?.chipnumber?.length ? dog.chipnumber : '')

    const [passport, setPassport] = useState(typeof dog?.passport === 'boolean' ? dog.passport : false)

    const [info, setInfo] = useState(dog?.info?.length ? dog.info : '')

    const [country, setCountry] = useState(dog?.country?.length ? dog.country : 'Argentina')

    const [region, setRegion] = useState(dog?.region?.length ? dog.region : 'none ')

    const [instagram, setInstagram] = useState(dog?.instagram?.length && dog?.instagram !== 'none ' ? dog.instagram : '')
    const [facebook, setFacebook] = useState(dog?.facebook?.length && dog?.facebook !== 'none ' ? dog.facebook : '')
    const [youtube, setYoutube] = useState(dog?.youtube?.length && dog?.youtube !== 'none ' ? dog.youtube : '')
    const [tiktok, setTiktok] = useState(dog?.tiktok?.length && dog?.tiktok !== 'none ' ? dog.tiktok : '')


    useEffect(() => {
        if (isSuccess) {
            navigate(`/dogs/${dog?.id}`)
        }
    }, [isSuccess, navigate])

    // Clear the region each time the country is changed to avoid having a region from another country
    const handleCountryChanged = (e) => {
        setCountry(e.target.value)
        setRegion('')
    }

    const handleDeathChanged = date => setDeath(date)
    const handleChipnumberChanged = e => setChipnumber(e.target.value)
    const handleInfoChanged = e => setInfo(e.target.value)
    const handleInstagramChanged = e => setInstagram(e.target.value)
    const handleFacebookChanged = e => setFacebook(e.target.value)
    const handleYoutubeChanged = e => setYoutube(e.target.value)
    const handleTiktokChanged = e => setTiktok(e.target.value)

    const handleHeatChanged = () => setHeat(prev => !prev)
    const handleSterilizedChanged = () => setSterilized(prev => !prev)
    const handleMicrochippedChanged = () => setMicrochipped(prev => !prev)
    const handlePassportChanged = () => setPassport(prev => !prev)

    const handleSaveDogClicked = async () => {
        let updatedInstagram = instagram
        let updatedFacebook = facebook
        let updatedYoutube = youtube
        let updatedTiktok = tiktok
        let updatedRegion = region
        let updatedInfo = info
        let updatedChipnumber = chipnumber

        // Values that can be cleared need to be changed to 'none '
        // They need to have a length in order to PATCH them in the backend
        // That is due to the fact that dogs are also PATCHed when they are added to litters
        // Adding to litters only provides the dog's ID and the litter's ID
        if (!instagram?.length) {
            updatedInstagram = 'none '
        }

        if (!facebook?.length) {
            updatedFacebook = 'none '
        }

        if (!youtube?.length) {
            updatedYoutube = 'none '
        }

        if (!tiktok?.length) {
            updatedTiktok = 'none '
        }

        if (!region?.length) {
            updatedRegion = 'none '
        }

        if (!info?.length) {
            updatedInfo = 'none '
        }

        if (!chipnumber?.length) {
            updatedChipnumber = 'none '
        }

        // PATCH the dog
        await updateDog({ id: dog.id, 
            country, region: updatedRegion, death, sterilized, passport, microchipped, 
            chipnumber: updatedChipnumber, info: updatedInfo, heat, 
            instagram: updatedInstagram, facebook: updatedFacebook, 
            youtube: updatedYoutube, tiktok: updatedTiktok })
    }

    // DELETE the dog
    const handleDeleteDogClicked = async () => {
        await deleteDog({ id: dog.id })
        navigate('/dogs')
    }

    // Boolean to control the 'disabled' value of the SAVE button
    let canSave = !isLoading

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p>{errContent}</p>

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <p className="edit-dog-page-title">Edit Dog</p>
                </div>
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
                                <option value="NONE ">Region (optional)</option>
                                {bigCountries?.includes(country) ? Regions[country] : null}
                            </select>
                            <br />
                            <br />
                        </>
                    : null
                }

                <label htmlFor="death">
                    <b>Date of Death</b>
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
                <Calendar minDate={new Date(dog?.birth) || null} maxDate={new Date()} onChange={handleDeathChanged} value={death} />
                <br />
                <br />

                <label htmlFor="passport" className="switch">
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

                <label htmlFor="heat">
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
                <br />

                <label htmlFor="sterilized">
                    <b>Sterilized</b>
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
                
                <label htmlFor="instagram">
                    <b>Instagram Username</b>
                </label>
                <br />
                <input 
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={instagram}
                    onChange={handleInstagramChanged}
                />
                <br />
                <br />
                
                <label htmlFor="facebook">
                    <b>Facebook Username</b>
                </label>
                <br />
                <input 
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={facebook}
                    onChange={handleFacebookChanged}
                />
                <br />
                <br />
                
                <label htmlFor="youtube">
                    <b>YouTube Username</b>
                </label>
                <br />
                <input 
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={youtube}
                    onChange={handleYoutubeChanged}
                />
                <br />
                <br />
                
                <label htmlFor="tiktok">
                    <b>TikTok Username</b>
                </label>
                <br />
                <input 
                    type="text"
                    id="tiktok"
                    name="tiktok"
                    value={tiktok}
                    onChange={handleTiktokChanged}
                />
                <br />
                <br />

                <label htmlFor="info">
                    <b>Info</b>
                </label>
                <br />
                <textarea 
                    rows="10"
                    cols="30"
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
                        title="Save"
                        onClick={handleSaveDogClicked}
                        disabled={!canSave}
                    >
                        Save
                    </button>
                    <button
                        className="edit-dog-delete-button black-button"
                        title="Delete"
                        onClick={handleDeleteDogClicked}
                    >
                        Delete
                    </button>
                </div>
            </form>
        </>
    )

  return content
}

export default EditDogForm

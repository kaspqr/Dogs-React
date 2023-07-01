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

    const [instagram, setInstagram] = useState(dog?.instagram?.length ? dog.instagram : '')
    const [facebook, setFacebook] = useState(dog?.facebook?.length ? dog.facebook : '')
    const [youtube, setYoutube] = useState(dog?.youtube?.length ? dog.youtube : '')
    const [tiktok, setTiktok] = useState(dog?.tiktok?.length ? dog.tiktok : '')

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
    const handleBirthChanged = e => setBirth(e.target.value)
    const handleDeathChanged = e => setDeath(e.target.value)
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
        await updateDog({ id: dog.id, name, location, owner, birth, death, sterilized, passport, microchipped, chipnumber, info, heat, instagram, facebook, youtube, tiktok })
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
                    <p className="edit-dog-page-title">Edit Dog</p>
                    <br />
                    <div>
                        <button
                            title="Save"
                            onClick={handleSaveDogClicked}
                            disabled={!canSave}
                        >
                            Save
                        </button>
                        <button
                            className="edit-dog-delete-button"
                            title="Delete"
                            onClick={handleDeleteDogClicked}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <br />
                <label htmlFor="name">
                    <b>Name: [2-20 letters]</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleNameChanged}
                />
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

                <label htmlFor="birth">
                    <b>Date of Birth:</b>
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
                    <b>Date of Death:</b>
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

                <label htmlFor="passport">
                    <b>Passport:</b>
                </label>
                <input 
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
                
                <label htmlFor="instagram">
                    <b>Instagram Username:</b>
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
                    <b>Facebook Username:</b>
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
                    <b>YouTube Username:</b>
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
                    <b>TikTok Username:</b>
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
                    <b>Info:</b>
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
            </form>
        </>
    )

  return content
}

export default EditDogForm


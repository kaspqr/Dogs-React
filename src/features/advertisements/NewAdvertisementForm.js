import { useState, useEffect } from "react"
import { useAddNewAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const NewAdvertisementForm = () => {

    const { userId } = useAuth()

    const [addNewAdvertisement, {
        isAdvertisementLoading,
        isAdvertisementSuccess,
        isAdvertisementError,
        advertisementError
    }] = useAddNewAdvertisementMutation()


    const navigate = useNavigate()

    const [title, setTitle] = useState('')

    const [type, setType] = useState('')

    const [price, setPrice] = useState('')

    const [info, setInfo] = useState('')

    useEffect(() => {
        if (isAdvertisementSuccess) {
            setTitle('')
            setType('')
            setPrice('')
            setInfo('')
        }
    }, [isAdvertisementSuccess, navigate])


    const canSave = title?.length && type?.length && price?.length && !isAdvertisementLoading

    let errMsg

    const handleSaveAdvertisementClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewAdvertisement({ poster: userId, title, price, type, info })
        }
    }


    const content = (
        <>
            {errMsg}
            <form onSubmit={handleSaveAdvertisementClicked}>
                <div>
                    <h2>Post Advertisement</h2>
                    <div>
                        <button
                            title="Post"
                            disabled={!canSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
                
                <label htmlFor="title">
                    Title:
                </label>
                <br />
                <input 
                    type="text" 
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />

                <label htmlFor="type">
                    Type:
                </label>
                <br />
                <select 
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">Select Type</option>
                    <option value="Sell">Sell</option>
                    <option value="Buy">Buy</option>
                    <option value="Found">Found</option>
                    <option value="Lost">Lost</option>
                    <option value="BreedingFemale">Breeding, Require Female</option>
                    <option value="BreedingMale">Breeding, Require Male</option>
                </select>
                <br />
                
                <label htmlFor="price">
                    Price:
                </label>
                <br />
                <input 
                    type="text" 
                    id="price"
                    name="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <br />
                
                <label htmlFor="info">
                    Info:
                </label>
                <br />
                <textarea 
                    id="info"
                    name="info"
                    cols="30"
                    rows="10"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                />
            </form>
        </>
    )

  return content
}

export default NewAdvertisementForm

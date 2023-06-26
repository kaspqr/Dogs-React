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
            await addNewAdvertisement({ "poster": userId, title, price, type, info })
        } else {
            errMsg = <p>Title, type and price is required</p>
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
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                
                <label htmlFor="title">
                    Title:
                </label>
                <input 
                    type="text" 
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="type">
                    Type:
                </label>
                <input 
                    type="text" 
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />

                
            </form>
        </>
    )

  return content
}

export default NewAdvertisementForm

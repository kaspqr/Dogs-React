import { useState, useEffect } from "react"
import { useUpdateAdvertisementMutation, useDeleteAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"

const PRICE_REGEX = /^[0-9]{1,10}$/


const EditAdvertisementForm = ({ advertisement }) => {

    const [updateAdvertisement, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateAdvertisementMutation()

    const [deleteAdvertisement, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAdvertisementMutation()


    const navigate = useNavigate()


    const [title, setTitle] = useState(advertisement?.title)

    const [type, setType] = useState(advertisement?.type)

    const [price, setPrice] = useState(advertisement?.price)
    const [validPrice, setValidPrice] = useState(PRICE_REGEX.test(price))

    const [info, setInfo] = useState(advertisement?.info)

    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price))
    }, [price])


    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            navigate('/advertisements')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const handleSaveAdvertisementClicked = async () => {
        await updateAdvertisement({ id: advertisement.id, title, info, type, price })
    }

    const handleDeleteAdvertisementClicked = async () => {
        await deleteAdvertisement({ id: advertisement.id })
    }

    let canSave = title?.length && type?.length && validPrice && !isLoading

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p>{errContent}</p>

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <h2>Edit Advertisement</h2>
                    <div>
                        <button
                            title="Save"
                            onClick={handleSaveAdvertisementClicked}
                            disabled={!canSave}
                        >
                            Save
                        </button>
                        <button
                            title="Delete"
                            onClick={handleDeleteAdvertisementClicked}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <label htmlFor="name">Title</label>
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
                <input 
                    type="textbox" 
                    id="info"
                    name="info"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                />
            </form>
        </>
    )

  return content
}

export default EditAdvertisementForm


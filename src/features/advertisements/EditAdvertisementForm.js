import { useState, useEffect } from "react"
import { useUpdateAdvertisementMutation, useDeleteAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"
import { Currencies } from "../../config/currencies"

const EditAdvertisementForm = ({ advertisement }) => {

    // PATCH method to update the advertisement
    const [updateAdvertisement, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateAdvertisementMutation()

    // DELETE method to delete the advertisement
    const [deleteAdvertisement, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAdvertisementMutation()

    const PRICE_REGEX = /^[1-9]\d{0,11}$/

    const navigate = useNavigate()

    const [title, setTitle] = useState(advertisement?.title)

    const [price, setPrice] = useState(advertisement?.price)
    const [validPrice, setValidPrice] = useState(PRICE_REGEX.test(price))

    const [currency, setCurrency] = useState(advertisement?.currency)

    const [info, setInfo] = useState(advertisement?.info)

    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price))
    }, [price])


    useEffect(() => {
        if (isDelSuccess) {
            // If the advertisement is DELETEd, go back to homepage
            navigate('/')
        } else if (isSuccess) {
            // If the advertisement is PATCHed, go to the page of said advertisement
            navigate(`/advertisements/${advertisement?.id}`)
        }
    }, [isSuccess, isDelSuccess, navigate])

    // PATCH function
    const handleSaveAdvertisementClicked = async () => {
        await updateAdvertisement({ id: advertisement.id, title, info, price, currency })
    }

    // DELETE function
    const handleDeleteAdvertisementClicked = async () => {
        await deleteAdvertisement({ id: advertisement.id })
    }

    // Boolean to control the style and 'disabled' of the SAVE button
    let canSave = title?.length && info?.length && (validPrice || advertisement?.type === 'Found' || advertisement?.type === 'Lost') && !isLoading

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p>{errContent}</p>

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <p className="advertisement-edit-page-title">Edit Advertisement</p>
                </div>
                <label htmlFor="name">
                    <b>Title</b>
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
                <br />

                {advertisement?.type !== 'Found' && advertisement?.type !== 'Lost'
                    ? <><label htmlFor="price">
                        <b>Price</b>
                        </label>
                        <br />
                        <input 
                            type="text" 
                            id="price"
                            name="price"
                            maxLength="12"
                            value={price}
                            onChange={(e) => {
                                if (PRICE_REGEX.test(e.target.value) || e.target.value === "") {
                                    setPrice(e.target.value)
                                }
                            }}
                        />
                        <br />
                        <br />

                        <label htmlFor="currency">
                            <b>Currency</b>
                        </label>
                        <br />
                        <select 
                            id="currency"
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {Currencies}
                        </select>
                        <br />
                        <br /></>
                    : null
                }

                <label htmlFor="info">
                    <b>Info</b>
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
                <br />
                <br />
                <div className="advertisement-edit-page-buttons-div">
                        <button
                            title="Save"
                            className="edit-advertisement-save-button black-button"
                            onClick={handleSaveAdvertisementClicked}
                            disabled={!canSave}
                            style={!canSave ? {backgroundColor: "grey", cursor: "default"} : null}
                        >
                            Save
                        </button>
                        <button
                            title="Delete"
                            className="edit-advertisement-delete-button black-button"
                            onClick={handleDeleteAdvertisementClicked}
                        >
                            Delete
                        </button>
                    </div>
            </form>
        </>
    )

  return content
}

export default EditAdvertisementForm


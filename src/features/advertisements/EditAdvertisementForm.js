import { useState, useEffect } from "react"
import { useUpdateAdvertisementMutation, useDeleteAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"
import { Currencies } from "../../config/currencies"
import { AdvertisementTypes } from "../../config/advertisementTypes"

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

    const PRICE_REGEX = /^[0-9]{1,10}$/

    const navigate = useNavigate()

    const [title, setTitle] = useState(advertisement?.title)

    const [type, setType] = useState(advertisement?.type)

    const [price, setPrice] = useState(advertisement?.price)
    const [validPrice, setValidPrice] = useState(PRICE_REGEX.test(price))

    const [currency, setCurrency] = useState(advertisement?.currency)

    const [info, setInfo] = useState(advertisement?.info)

    const [country, setCountry] = useState(advertisement?.country)

    const [region, setRegion] = useState(advertisement?.region)

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
        await updateAdvertisement({ id: advertisement.id, title, info, type, price, currency, country, region })
    }

    // DELETE function
    const handleDeleteAdvertisementClicked = async () => {
        await deleteAdvertisement({ id: advertisement.id })
    }

    // Clear the region each time a country is changed to avoid having a region from a different country
    const handleCountryChanged = (e) => {
        setRegion('')
        setCountry(e.target.value)
    }

    // Boolean to control the style and 'disabled' of the SAVE button
    let canSave = title?.length && type?.length && validPrice && !isLoading

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

                <label htmlFor="type">
                    <b>Type</b>
                </label>
                <br />
                <select 
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {AdvertisementTypes}
                </select>
                <br />
                <br />

                <label htmlFor="price">
                    <b>Price</b>
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
                <br />

                <label htmlFor="country">
                    <b>Country</b>
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
                                <option value="">Region (optional)</option>
                                {bigCountries?.includes(country) ? Regions[country] : null}
                            </select>
                            <br />
                            <br />
                        </>
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


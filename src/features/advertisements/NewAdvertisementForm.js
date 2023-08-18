import { useState, useEffect } from "react"
import { useAddNewAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"
import { AdvertisementTypes } from "../../config/advertisementTypes"
import { Currencies } from "../../config/currencies"

const NewAdvertisementForm = () => {

    const { userId } = useAuth()

    // POST method for a new advertisement
    const [addNewAdvertisement, {
        isLoading: isAdvertisementLoading,
        isSuccess: isAdvertisementSuccess,
        isError: isAdvertisementError,
        error: advertisementError
    }] = useAddNewAdvertisementMutation()

    const navigate = useNavigate()

    const PRICE_REGEX = /^[1-9]\d{0,11}$/

    const [title, setTitle] = useState('')

    const [type, setType] = useState('Sell')

    const [price, setPrice] = useState()

    const [currency, setCurrency] = useState('$')

    const [country, setCountry] = useState('Argentina')

    const [region, setRegion] = useState('')

    const [info, setInfo] = useState('')

    useEffect(() => {
        // Once POSTed, set everything back to default
        if (isAdvertisementSuccess) {
            setTitle('')
            setType('')
            setPrice('')
            setCurrency('$')
            setCountry('Argentina')
            setRegion('')
            setInfo('')
            navigate('/')
        }
    }, [isAdvertisementSuccess, navigate])

    if (isAdvertisementError) return <p>{advertisementError}</p>

    // Boolean to control the style and 'disabled' value of the SAVE button
    const canSave = title?.length && type?.length && info?.length && !isAdvertisementLoading
        && (type === 'Found' || type === 'Lost' || (price?.length && currency?.length)) 

    const handleSaveAdvertisementClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            // POST method for an advertisement
            await addNewAdvertisement({ poster: userId, title, price, type, info, currency, country, region })
        }
    }

    // Clear the region every time the country is changed to prevent having a region from a different country
    const handleCountryChanged = (e) => {
        setRegion('')
        setCountry(e.target.value)
    }

    const handleTypeChanged = (e) => {
        if (e.target.value === 'Lost' || e.target.value === 'Found') {
            // Price nor currency is allowed with above types
            setPrice('')
            setCurrency('')
        }
        setType(e.target.value)
    }

    const content = (
        <>
            <form onSubmit={handleSaveAdvertisementClicked}>
                <div>
                    <p className="advertisement-post-page-title">Post Advertisement</p>
                </div>
                
                <label htmlFor="title">
                    <b>Title</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="title"
                    name="title"
                    maxLength="50"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />

                <label htmlFor="type">
                    <b>Type</b>
                </label>
                <br />
                <select 
                    id="type"
                    name="type"
                    value={type}
                    onChange={handleTypeChanged}
                >
                    {AdvertisementTypes}
                </select>
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
                    disabled={type === 'Found' || type === 'Lost'}
                    onChange={(e) => {
                        if (PRICE_REGEX.test(e.target.value) || e.target.value === '') {
                            setPrice(e.target.value)}
                        }
                    }
                />
                <br />
                
                <label htmlFor="currency">
                    <b>Currency</b>
                </label>
                <br />
                <select 
                    id="currency"
                    name="currency"
                    value={currency}
                    disabled={type === 'Found' || type === 'Lost'}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    <option value="">--</option>
                    {Currencies}
                </select>
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

                <label htmlFor="region">
                    <b>Region</b>
                </label>
                <br />
                <select 
                    disabled={!bigCountries?.includes(country)}
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

                <label htmlFor="info">
                    <b>Info</b>
                </label>
                <br />
                <textarea 
                    id="info"
                    name="info"
                    cols="30"
                    rows="10"
                    maxLength="500"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                />
                <br />
                <br />

                <div className="advertisement-post-page-buttons-div">
                    <button
                        style={!canSave ? {backgroundColor: "grey", cursor: "default"} : null}
                        className="black-button"
                        title="Post"
                        disabled={!canSave}
                    >
                        Post
                    </button>
                </div>
            </form>
        </>
    )

  return content
}

export default NewAdvertisementForm

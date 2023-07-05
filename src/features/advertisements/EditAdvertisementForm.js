import { useState, useEffect } from "react"
import { useUpdateAdvertisementMutation, useDeleteAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"

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

    const [currency, setCurrency] = useState(advertisement?.currency)

    const [info, setInfo] = useState(advertisement?.info)

    const [country, setCountry] = useState(advertisement?.country)

    const [region, setRegion] = useState(advertisement?.region)

    useEffect(() => {
        setValidPrice(PRICE_REGEX.test(price))
    }, [price])


    useEffect(() => {
        if (isDelSuccess) {
            navigate('/')
        } else if (isSuccess) {
            navigate(`/advertisements/${advertisement?.id}`)
        }
    }, [isSuccess, isDelSuccess, navigate])

    const handleSaveAdvertisementClicked = async () => {
        await updateAdvertisement({ id: advertisement.id, title, info, type, price, currency, country, region })
    }

    const handleDeleteAdvertisementClicked = async () => {
        await deleteAdvertisement({ id: advertisement.id })
    }

    const handleCountryChanged = (e) => {
        setRegion('')
        setCountry(e.target.value)
    }

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
                    <option value="Sell">Sell</option>
                    <option value="Buy">Buy</option>
                    <option value="Found">Found</option>
                    <option value="Lost">Lost</option>
                    <option value="BreedingFemale">Breeding, Require Female</option>
                    <option value="BreedingMale">Breeding, Require Male</option>
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
                    <option value="$">USD $</option>
                    <option value="€">EUR €</option>
                    <option value="£">GBP £</option>
                    <option value="zł">PLN zł</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="NZD">NZD</option>
                    <option value="SEK">SEK</option>
                    <option value="NOK">NOK</option>
                    <option value="DKK">DKK</option>
                    <option value="CHF">CHF</option>
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


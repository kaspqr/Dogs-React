import { cloneElement, useState, useEffect } from "react"
import { useAddNewAdvertisementMutation } from "./advertisementsApiSlice"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { ArgentinaRegions, AustraliaRegions, BrazilRegions, CanadaRegions,
    ChileRegions, FinlandRegions, FranceRegions, GermanyRegions, ItalyRegions, 
    MexicoRegions, NorwayRegions, NZRegions, PolandRegions, PortugalRegions, 
    RomaniaRegions, SARegions, SpainRegions, SwedenRegions, UKRegions, USARegions } from "../../config/regions"

const NewAdvertisementForm = () => {

    const { userId } = useAuth()

    const [addNewAdvertisement, {
        isLoading: isAdvertisementLoading,
        isSuccess: isAdvertisementSuccess,
        isError: isAdvertisementError,
        error: advertisementError
    }] = useAddNewAdvertisementMutation()


    const navigate = useNavigate()

    const [title, setTitle] = useState('')

    const [type, setType] = useState('')

    const [price, setPrice] = useState()

    const [currency, setCurrency] = useState('$')

    const [country, setCountry] = useState('Argentina')

    const [region, setRegion] = useState('')

    const [info, setInfo] = useState('')

    useEffect(() => {
        if (isAdvertisementSuccess) {
            setTitle('')
            setType('')
            setPrice('')
            setInfo('')
            navigate('/')
        }
    }, [isAdvertisementSuccess, navigate])


    const canSave = title?.length && type?.length && price?.length && !isAdvertisementLoading

    let errMsg

    const handleSaveAdvertisementClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewAdvertisement({ poster: userId, title, price, type, info, currency })
        }
    }


    let regions = null

    const handleCountryChanged = (e) => {
        setCountry(e.target.value)
        if (e.target.value === 'Argentina') regions = ArgentinaRegions
        else if (e.target.value === 'Australia') regions = AustraliaRegions
        else if (e.target.value === 'Brazil') regions = BrazilRegions
        else if (e.target.value === 'Canada') regions = CanadaRegions
        else if (e.target.value === 'Chile') regions = ChileRegions
        else if (e.target.value === 'Finland') regions = FinlandRegions
        else if (e.target.value === 'France') regions = FranceRegions
        else if (e.target.value === 'Germany') regions = GermanyRegions
        else if (e.target.value === 'Italy') regions = ItalyRegions
        else if (e.target.value === 'Mexico') regions = MexicoRegions
        else if (e.target.value === 'Norway') regions = NorwayRegions
        else if (e.target.value === 'New Zealand') regions = NZRegions
        else if (e.target.value === 'Poland') regions = PolandRegions
        else if (e.target.value === 'Portugal') regions = PortugalRegions
        else if (e.target.value === 'Romania') regions = RomaniaRegions
        else if (e.target.value === 'South Africa') regions = SARegions
        else if (e.target.value === 'Spain') regions = SpainRegions
        else if (e.target.value === 'Sweden') regions = SwedenRegions
        else if (e.target.value === 'United Kingdom') regions = UKRegions
        else if (e.target.value === 'United States') regions = USARegions
        const mapped = regions?.map(option => option)
        console.log(mapped)
    }


    const content = (
        <>
            {errMsg}
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
                    <option value=""><span className="select-option-span">Select Type</span></option>
                    <option value="Sell"><span className="select-option-span">Sell</span></option>
                    <option value="Buy"><span className="select-option-span">Buy</span></option>
                    <option value="Found"><span className="select-option-span">Found</span></option>
                    <option value="Lost"><span className="select-option-span">Lost</span></option>
                    <option value="BreedingFemale"><span className="select-option-span">Breeding, Require Female</span></option>
                    <option value="BreedingMale"><span className="select-option-span">Breeding, Require Male</span></option>
                </select>
                <br />
                <br />
                
                <label htmlFor="price">
                    <b>Price</b>
                </label>
                <br />
                <input 
                    type="number" 
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
                    <option value="JPY">JPY</option>
                    <option value="CNY">CNY</option>
                    <option value="KRW">KRW</option>
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

                <label htmlFor="region">
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
                    {regions?.map((option, index) => cloneElement(option, { key: index }))}
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

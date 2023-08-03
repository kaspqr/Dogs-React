import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import Advertisement from "./Advertisement"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { AdvertisementTypes } from "../../config/advertisementTypes"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const AdvertisementsList = () => {

  const { userId } = useAuth()

  const [title, setTitle] = useState('')

  const [type, setType] = useState('')

  const [country, setCountry] = useState('')

  const [region, setRegion] = useState('')

  const [filteredIds, setFilteredIds] = useState([])

  // GET all the advertisements
  const {
    data: advertisements,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementsQuery('advertisementsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  
  const handleCountryChanged = (e) => {
    setRegion('')
    setCountry(e.target.value)
  }

  const handleSearchClicked = () => {
  
    const filteredAdsTitle = Object.values(advertisements?.entities)?.filter((ad) => {
      return ad.title?.includes(title)
    })
  
    const filteredAdsRegion = region?.length
      ? filteredAdsTitle?.filter((ad) => {
        return ad.region === region
      })
      : filteredAdsTitle
  
    const filteredAdsCountry = country?.length
      ? filteredAdsRegion?.filter((ad) => {
        return ad.country === country
      })
      : filteredAdsRegion
  
    const filteredAdsType = type?.length
      ? filteredAdsCountry?.filter((ad) => {
        return ad.type === type
      })
      : filteredAdsCountry

    const finalFilteredAds = filteredAdsType

    if (!finalFilteredAds?.length) alert("Unfortunately, no matching advertisement has been found")

    const filteredIds = finalFilteredAds?.map((ad) => {
      return ad._id
    })

    setFilteredIds(filteredIds || [])

    console.log(filteredIds)
    
  }

  // Variable for displaying either an error or the content if the fetch was sucessful
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {

    const { ids } = advertisements

    const tableContent = filteredIds?.length
      ? filteredIds?.map(advertisementId => <Advertisement key={advertisementId} advertisementId={advertisementId} />)
      : ids?.map(advertisementId => <Advertisement key={advertisementId} advertisementId={advertisementId} />)

    content = (
      <>
        {userId?.length ? <Link className="list-add-new-title" to={'/advertisements/new'}><button className="black-button">Post an Advertisement</button></Link> : null}
        
        <p><b>Title</b></p>
        <input 
          name="advertisement-title-search-input" 
          id="advertisement-title-search-input" 
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <p><b>Type</b></p>
        <select 
          name="advertisement-type" 
          id="advertisement-type"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">--</option>
          {AdvertisementTypes}
        </select>
        
        <p><b>Country</b></p>
        <select 
          name="advertisement-country" 
          id="advertisement-country"
          onChange={handleCountryChanged}
        >
          <option value="">--</option>
          {Countries}
        </select>
        
        <p><b>Region</b></p>
        <select 
          name="advertisement-country" 
          id="advertisement-country"
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">--</option>
          {bigCountries?.includes(country)
            ? Regions[country]
            : null
          }
        </select>

        <br />
        <br />

        <button 
          onClick={handleSearchClicked}
          className="black-button"
        >
          Search <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faMagnifyingGlass} />
        </button>

        <br />
        <br />

        <table id="advertisement-table" className="content-table">
          <thead>
            <tr>
              <th className="first-th">Title</th>
              <th>Poster</th>
              <th>Type</th>
              <th className="last-th">Price</th>
            </tr>
          </thead>
            <tbody>{tableContent}</tbody>
        </table>
      </>
    )
  }

  return content
}

export default AdvertisementsList

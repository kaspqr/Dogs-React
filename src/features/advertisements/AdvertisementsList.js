import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import Advertisement from "./Advertisement"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { AdvertisementTypes } from "../../config/advertisementTypes"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"
import { Currencies } from "../../config/currencies"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"

const AdvertisementsList = () => {

  const { userId } = useAuth()

  const [title, setTitle] = useState('')

  const [type, setType] = useState('')

  const [country, setCountry] = useState('')

  const [region, setRegion] = useState('')

  const [currency, setCurrency] = useState('')

  const [price, setPrice] = useState()

  const [filteredIds, setFilteredIds] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [newPage, setNewPage] = useState('')

  const currencyAndPriceDisabled = type === 'Found' || type === 'Lost' || type === ''

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const handleTypeChanged = (e) => {
    if (e.target.value === '' || e.target.value === 'Found' || e.target.value === 'Lost') {
      setCurrency('')
      setPrice('')
    }
    setType(e.target.value)
  }

  const handleToggleFilterView = () => {
    const filterDiv = document.getElementById('ad-filter-div')
    if (filterDiv?.style?.display === 'none') {
      filterDiv.style.display = 'block'
    } else {
      filterDiv.style.display = 'none'
    }
  }

  const handleSearchClicked = () => {

    setCurrentPage(1)
  
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
  
    const filteredAdsCurrency = currency?.length
      ? filteredAdsType?.filter((ad) => {
        return ad.currency === currency
      })
      : filteredAdsCountry

    const finalFilteredAds = filteredAdsCurrency

    if (!finalFilteredAds?.length) alert("Unfortunately, no matching advertisement has been found")

    const filteredIds = finalFilteredAds?.reverse().map((ad) => {
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

    const reversedNewIds = Object.values(advertisements?.entities)?.reverse().map((ad) => {
      return ad._id
    })

    const itemsPerPage = 50

    const maxPage = Math.ceil(filteredIds?.length ? filteredIds?.length / itemsPerPage : reversedNewIds?.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const advertisementsToDisplay = filteredIds?.length
      ? filteredIds.slice(startIndex, endIndex)
      : reversedNewIds.slice(startIndex, endIndex)

    const goToPageButtonDisabled = newPage < 1 || newPage > maxPage || parseInt(newPage) === currentPage

    // Advertisement component for each advertisement
    const tableContent = advertisementsToDisplay.map(advertisementId => (
      <Advertisement key={advertisementId} advertisementId={advertisementId} />
    ))

    content = (
      <>
        {userId?.length ? <Link to={'/advertisements/new'}><button className="black-button">Post an Advertisement</button></Link> : null}

        <br />
        <br />

        <button
          className="black-button"
          onClick={handleToggleFilterView}
        >
          Toggle Search View
        </button>

        <br />
        <br />

        <div id="ad-filter-div" style={{display: "none"}}>
          <p><b>Title</b></p>
          <input 
            value={title}
            name="advertisement-title-search-input" 
            id="advertisement-title-search-input" 
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <p><b>Type</b></p>
          <select 
            value={type}
            name="advertisement-type" 
            id="advertisement-type"
            onChange={handleTypeChanged}
          >
            <option value="">--</option>
            {AdvertisementTypes}
          </select>
          
          <p><b>Country</b></p>
          <select 
            value={country}
            name="advertisement-country" 
            id="advertisement-country"
            onChange={handleCountryChanged}
          >
            <option value="">--</option>
            {Countries}
          </select>
          
          <p><b>Region</b></p>
          <select 
            value={region}
            name="advertisement-region" 
            id="advertisement-region"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">--</option>
            {bigCountries?.includes(country)
              ? Regions[country]
              : null
            }
          </select>

          <p><b>Currency</b></p>
          <select 
            value={currency}
            name="advertisement-currency" 
            id="advertisement-currency"
            onChange={(e) => setCurrency(e.target.value)}
            disabled={currencyAndPriceDisabled}
          >
            <option value="">--</option>
            {Currencies}
          </select>

          <p><b>Price</b></p>
          <input 
            disabled={currencyAndPriceDisabled}
            type="number" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            name="advertisement-price"
            id="advertisement-price"
          />

          <br />
          <br />

          <button 
            onClick={handleSearchClicked}
            className="black-button search-button"
          >
            Search <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faMagnifyingGlass} />
          </button>

          <br />
          <br />
        </div>

        <p>
          <button 
            style={currentPage === 1 ? {backgroundColor: "grey", cursor: "default"} : null}
            disabled={currentPage === 1}
            className="black-button pagination-button"
            onClick={() => {
              setCurrentPage(currentPage - 1)
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
          </button>

          {` Page ${currentPage} of ${maxPage} `}

          <button 
            className="black-button pagination-button"
            style={currentPage === maxPage ? {backgroundColor: "grey", cursor: "default"} : null}
            disabled={currentPage === maxPage}
            onClick={() => {
              setCurrentPage(currentPage + 1)
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
          </button>

          {windowWidth > 600 ? null : <><br /><br /></>}

          <span 
            className="new-page-input-span"
            style={windowWidth > 600 ? null : {float: "none"}}
          >
            <input 
              onChange={(e) => setNewPage(e.target.value)} 
              value={newPage} 
              type="number" 
              className="new-page-input"
              placeholder="Page no."
            />
            <button
              style={goToPageButtonDisabled ? {backgroundColor: "grey", cursor: "default"} : null}
              disabled={goToPageButtonDisabled}
              onClick={() => {
                if (newPage >= 1 && newPage <= maxPage) {
                  setCurrentPage(parseInt(newPage))
                }
              }}
              className="black-button"
            >
              Go to Page
            </button>
          </span>

        </p>

        <br />

        <table id="advertisement-table" className="content-table">
          <thead>
            <tr>
              <th className="first-th">Title</th>
              {windowWidth > 600
                ? <><th>Poster</th>
                  <th>Type</th></>
                : null
              }
              <th className="last-th">Price</th>
            </tr>
          </thead>
            <tbody>{tableContent}</tbody>
        </table>

        <br />

        <p>
          <button 
            style={currentPage === 1 ? {backgroundColor: "grey", cursor: "default"} : null}
            disabled={currentPage === 1}
            className="black-button pagination-button"
            onClick={() => {
              setCurrentPage(currentPage - 1)
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
          </button>

          {` Page ${currentPage} of ${maxPage} `}

          <button 
            className="black-button pagination-button"
            style={currentPage === maxPage ? {backgroundColor: "grey", cursor: "default"} : null}
            disabled={currentPage === maxPage}
            onClick={() => {
              setCurrentPage(currentPage + 1)
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
          </button>

          {windowWidth > 600 ? null : <><br /><br /></>}

          <span 
            className="new-page-input-span"
            style={windowWidth > 600 ? null : {float: "none"}}
          >
            <input 
              onChange={(e) => setNewPage(e.target.value)} 
              value={newPage} 
              type="number" 
              className="new-page-input"
              placeholder="Page no."
            />
            <button
              style={goToPageButtonDisabled ? {backgroundColor: "grey", cursor: "default"} : null}
              disabled={goToPageButtonDisabled}
              onClick={() => {
                if (newPage >= 1 && newPage <= maxPage) {
                  setCurrentPage(parseInt(newPage))
                }
              }}
              className="black-button"
            >
              Go to Page
            </button>
          </span>

        </p>
      </>
    )
  }

  return content
}

export default AdvertisementsList

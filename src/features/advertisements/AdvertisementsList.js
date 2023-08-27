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

  const PRICE_REGEX = /^[1-9]\d{0,11}$/

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [currency, setCurrency] = useState('')
  const [lowestPrice, setLowestPrice] = useState('')
  const [highestPrice, setHighestPrice] = useState('')
  const [filteredIds, setFilteredIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [newPage, setNewPage] = useState('')
  const [sort, setSort] = useState('')

  const currencyDisabled = type === 'Found' || type === 'Lost' || type === ''

  // State for checking how wide is the user's screen
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Function for handling the resizing of screen
  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  // Always check if a window is being resized
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
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  
  const handleCountryChanged = (e) => {
    // New country doesn't have the regions of the old one, so reset the region first
    setRegion('')
    setCountry(e.target.value)
  }

  const handleCurrencyChanged = (e) => {
    if (e.target.value === '') { // Cannot have a price without currency
      setLowestPrice('')
      setHighestPrice('')
      setSort('')
    }
    setCurrency(e.target.value)
  }

  const handleTypeChanged = (e) => {
    if (e.target.value === '' || e.target.value === 'Found' || e.target.value === 'Lost') {
      // Cannot have a currency nor price with above types
      setCurrency('')
      setLowestPrice('')
      setHighestPrice('')
      setSort('')
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

    if (lowestPrice?.length && highestPrice?.length && highestPrice < lowestPrice) {
      return alert("Highest price cannot be lower than lowest price")
    }

    setCurrentPage(1)
  
    // Go through each filter
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
      : filteredAdsType
  
    const filteredAdsLowestPrice = lowestPrice?.length
      ? filteredAdsCurrency?.filter((ad) => {
        return ad.price >= parseInt(lowestPrice)
      })
      : filteredAdsCurrency
  
    const filteredAdsHighestPrice = highestPrice?.length
      ? filteredAdsLowestPrice?.filter((ad) => {
        return ad.price <= parseInt(highestPrice)
      })
      : filteredAdsLowestPrice

    const finalFilteredAds = !sort?.length 
      ? filteredAdsHighestPrice
      : sort === 'ascending'
        ? filteredAdsHighestPrice.sort((a, b) => b.price - a.price)
        : sort === 'descending'
          ? filteredAdsHighestPrice.sort((a, b) => a.price - b.price)
          : filteredAdsHighestPrice

    if (!finalFilteredAds?.length) alert("Unfortunately, no matching advertisement has been found")

    // Reverse in order to get newest ads first
    const filteredIds = finalFilteredAds?.reverse().map((ad) => {
      return ad._id
    })

    setFilteredIds(filteredIds || [])
  }

  // Variable for displaying either an error or the content if the fetch was sucessful
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {

    // Reverse initial ads (without filters) in order to display the newest ones first
    const reversedNewIds = Object.values(advertisements?.entities)?.reverse().map((ad) => {
      return ad._id
    })

    const itemsPerPage = 20

    const maxPage = Math.ceil(filteredIds?.length ? filteredIds?.length / itemsPerPage : reversedNewIds?.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // What to display on the current page
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
        {userId?.length ? <><Link to={'/advertisements/new'}><button title="Post an Advertisement" className="black-button three-hundred">Post an Advertisement</button></Link><br /><br /></> : null}

        {!reversedNewIds?.length 
          ? <p>There are currently no advertisements</p>
          : <>
              <button
                title="Toggle Search View"
                className="black-button three-hundred"
                onClick={handleToggleFilterView}
              >
                Toggle Search View
              </button>

              <br />
              <br />

              <div id="ad-filter-div" style={{display: "none"}}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="advertisement-title-search-input"><b>Title</b></label>
                  <br />
                  <input 
                    className="three-hundred"
                    value={title}
                    name="advertisement-title-search-input" 
                    id="advertisement-title-search-input" 
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <br />
                  
                  <label className="top-spacer" htmlFor="advertisement-type"><b>Type</b></label>
                  <br />
                  <select 
                    value={type}
                    name="advertisement-type" 
                    id="advertisement-type"
                    onChange={handleTypeChanged}
                  >
                    <option value="">--</option>
                    {AdvertisementTypes}
                  </select>
                  <br />
                  
                  <label className="top-spacer" htmlFor="advertisement-country"><b>Country</b></label>
                  <br />
                  <select 
                    value={country}
                    name="advertisement-country" 
                    id="advertisement-country"
                    onChange={handleCountryChanged}
                  >
                    <option value="">--</option>
                    {Countries}
                  </select>
                  <br />
                  
                  <label className="top-spacer" htmlFor="advertisement-region"><b>Region</b></label>
                  <br />
                  <select 
                    disabled={!bigCountries.includes(country)}
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
                  <br />

                  <label className="top-spacer" htmlFor="advertisement-currency"><b>Currency</b></label>
                  <br />
                  <select 
                    value={currency}
                    name="advertisement-currency" 
                    id="advertisement-currency"
                    onChange={handleCurrencyChanged}
                    disabled={currencyDisabled}
                  >
                    <option value="">--</option>
                    {Currencies}
                  </select>

                  <br />

                  <label className="top-spacer" htmlFor="advertisement-lowest-price"><b>Lowest Price</b></label>
                  <br />
                  <input 
                    className="three-hundred"
                    type="text"
                    value={lowestPrice}
                    name="advertisement-lowest-price" 
                    id="advertisement-lowest-price"
                    onChange={(e) => {
                      if (PRICE_REGEX.test(e.target.value) || e.target.value === '') {
                        setLowestPrice(e.target.value)}
                      }
                    }
                    disabled={!currency?.length}
                  />

                  <br />

                  <label className="top-spacer" htmlFor="advertisement-highest-price"><b>Highest Price</b></label>
                  <br />
                  <input 
                    className="three-hundred"
                    type="text"
                    value={highestPrice}
                    name="advertisement-highest-price" 
                    id="advertisement-highest-price"
                    onChange={(e) => {
                      if (PRICE_REGEX.test(e.target.value) || e.target.value === '') {
                        setHighestPrice(e.target.value)}
                      }
                    }
                    disabled={!currency?.length}
                  />

                  <br />

                  <label className="top-spacer" htmlFor="sort-by-price"><b>Sort by Price</b></label>
                  <br />
                  <select 
                    value={sort}
                    name="sort-by-price" 
                    id="sort-by-price"
                    onChange={(e) => setSort(e.target.value)}
                    disabled={!currency?.length}
                  >
                    <option value="">--</option>
                    <option value="ascending">Ascending</option>
                    <option value="descending">Descending</option>
                  </select>
                </form>

                <br />

                <button 
                  onClick={handleSearchClicked}
                  className="black-button search-button three-hundred"
                  title="Search"
                >
                  Search <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faMagnifyingGlass} />
                </button>

                <br />
                <br />
              </div>
            <p>
              <button 
                title="Go to Previous Page"
                style={currentPage === 1 ? {display: "none"} : null}
                disabled={currentPage === 1}
                className="pagination-button"
                onClick={() => {
                  setCurrentPage(currentPage - 1)
                }}
              >
                <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
              </button>

              {` Page ${currentPage} of ${maxPage} `}

              <button 
                title="Go to Next Page"
                className="pagination-button"
                style={currentPage === maxPage ? {display: "none"} : null}
                disabled={currentPage === maxPage}
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                }}
              >
                <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
              </button>

              {windowWidth > 600 || maxPage === 1 ? null : <><br /><br /></>}

              <span 
                className="new-page-input-span"
                style={maxPage === 1 
                  ? {display: "none"}
                  : windowWidth > 600 
                    ? null 
                    : {float: "none"}
                }
              >
                <label className="off-screen" htmlFor="page-number">Page Number</label>
                <input 
                  onChange={(e) => setNewPage(e.target.value)} 
                  value={newPage} 
                  type="number" 
                  name="page-number"
                  className="new-page-input"
                  placeholder="Page no."
                />
                <button
                  title="Go to the Specified Page"
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

            {tableContent}

            <br />

            <p>
              <button 
                title="Go to Previous Page"
                style={currentPage === 1 ? {display: "none"} : null}
                disabled={currentPage === 1}
                className="pagination-button"
                onClick={() => {
                  setCurrentPage(currentPage - 1)
                }}
              >
                <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
              </button>

              {` Page ${currentPage} of ${maxPage} `}

              <button 
                title="Go to Next Page"
                className="pagination-button"
                style={currentPage === maxPage ? {display: "none"} : null}
                disabled={currentPage === maxPage}
                onClick={() => {
                  setCurrentPage(currentPage + 1)
                }}
              >
                <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
              </button>

              {windowWidth > 600 || maxPage === 1 ? null : <><br /><br /></>}

              <span 
                className="new-page-input-span"
                style={maxPage === 1 
                  ? {display: "none"}
                  : windowWidth > 600 
                    ? null 
                    : {float: "none"}
                }
              >
                <label className="off-screen" htmlFor="another-page-number">Page Number</label>
                <input 
                  onChange={(e) => setNewPage(e.target.value)} 
                  value={newPage} 
                  type="number" 
                  className="new-page-input"
                  placeholder="Page no."
                  name="another-page-number"
                />
                <button
                  title="Go to the Specified Page"
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
        }
      </>
    )
  }

  return content
}

export default AdvertisementsList

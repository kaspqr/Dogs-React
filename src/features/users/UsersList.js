import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"

const UsersList = () => {

  const [username, setUsername] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [filteredIds, setFilteredIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [newPage, setNewPage] = useState('')

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
  
  const handleCountryChanged = (e) => {
    setRegion('')
    setCountry(e.target.value)
  }

  const handleToggleFilterView = () => {
    const filterDiv = document.getElementById('user-filter-div')
    if (filterDiv?.style?.display === 'none') {
      filterDiv.style.display = 'block'
    } else {
      filterDiv.style.display = 'none'
    }
  }

  // GET all the users
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const handleSearchClicked = () => {

    setCurrentPage(1)

    // Go through all the filters
    const filteredUsers = username?.length
      ? Object.values(users?.entities)?.filter((user) => {
        return user.username.includes(username)
      })
      : Object.values(users?.entities)

    const filteredRegion = region?.length
      ? filteredUsers?.filter((user) => {
          return user.region === region
        })
      : filteredUsers

    const filteredCountry = country?.length
      ? filteredRegion?.filter((user) => {
          return user.country === country
        })
      : filteredRegion

    if (!filteredCountry?.length) alert("Unfortunately, no matching user has been found")

    const filteredIds = filteredCountry?.reverse().map((user) => {
      return user._id
    })

    setFilteredIds(filteredIds || [])
    
  }

  // Variable for storing errors and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) content = <p>{error?.data?.message}</p>

  if (isSuccess) {

    // Newer users first
    const reversedNewIds = Object.values(users?.entities)?.reverse().map((user) => {
      return user._id
    })

    const itemsPerPage = 50

    const maxPage = Math.ceil(filteredIds?.length ? filteredIds?.length / itemsPerPage : reversedNewIds?.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Users to display on current page
    const usersToDisplay = filteredIds?.length
      ? filteredIds.slice(startIndex, endIndex)
      : reversedNewIds.slice(startIndex, endIndex)

    const goToPageButtonDisabled = newPage < 1 || newPage > maxPage || parseInt(newPage) === currentPage

    // User component for each user
    const tableContent = usersToDisplay.map(userId => (
      <User key={userId} userId={userId} />
    ))

    content = (
      <>
        <button
          className="black-button"
          onClick={handleToggleFilterView}
        >
          Toggle Search View
        </button>

        <br />
        <br />

        <div id="user-filter-div" style={{display: "none"}}>
          <p><b>Username</b></p>
          <input 
            type="text"
            value={username}
            name="user-username-search-input" 
            id="user-username-search-input" 
            onChange={(e) => setUsername(e.target.value)}
          />

          <br />

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

        <table className="content-table">
          <thead>
            <tr><th>Username</th><th>Location</th></tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>

        <br />

        <p>
          <button 
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

export default UsersList

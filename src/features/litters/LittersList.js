import { useGetLittersQuery } from "./littersApiSlice"
import Litter from "./Litter"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import Calendar from "react-calendar"
import '../../styles/customCalendar.css'

const LittersList = () => {

  const { userId } = useAuth()

  const PUPPIES_AMOUNT_REGEX = /^[1-9]\d{0,1}$/

  const [bornEarliest, setBornEarliest] = useState('')
  const [bornLatest, setBornLatest] = useState('')
  const [lowestPuppies, setLowestPuppies] = useState('')
  const [highestPuppies, setHighestPuppies] = useState('')
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

  // GET all the litters
  const {
    data: litters,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetLittersQuery('littersList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const handleBornEarliestChanged = date => setBornEarliest(date)
  const handleBornLatestChanged = date => setBornLatest(date)

  const handleToggleFilterView = () => {
    const filterDiv = document.getElementById('litter-filter-div')
    if (filterDiv?.style?.display === 'none') {
      filterDiv.style.display = 'block'
    } else {
      filterDiv.style.display = 'none'
    }
  }

  const handleSearchClicked = () => {
    if (lowestPuppies?.length && highestPuppies?.length && highestPuppies < lowestPuppies) {
      return alert("Highest amount of puppies cannot be lower than lowest amount of puppies")
    }

    setCurrentPage(1)

    const finalBornEarliest = bornEarliest !== '' ? new Date(bornEarliest) : ''

    // Go through all the filters
    const filteredLittersBornEarliest = finalBornEarliest !== ''
      ? Object.values(litters?.entities)?.filter((litter) => {
        return new Date(litter.born) >= finalBornEarliest
      })
      : Object.values(litters?.entities)

    const finalBornLatest = bornLatest !== '' ? new Date(bornLatest) : ''

    const filteredLittersBornLatest = finalBornLatest !== ''
      ? filteredLittersBornEarliest?.filter((litter) => {
        return new Date(litter.born) <= finalBornLatest
      })
      : filteredLittersBornEarliest
  
    const filteredLittersLowestPuppies = lowestPuppies?.length
      ? filteredLittersBornLatest?.filter((litter) => {
        return litter.children >= parseInt(lowestPuppies)
      })
      : filteredLittersBornLatest
  
    const filteredLittersHighestPuppies = highestPuppies?.length
      ? filteredLittersLowestPuppies?.filter((litter) => {
        return litter.children <= parseInt(highestPuppies)
      })
      : filteredLittersLowestPuppies

    const finalFilteredLitters = filteredLittersHighestPuppies

    if (!finalFilteredLitters?.length) alert("Unfortunately, no matching litter has been found")

    // Reverse to get newest to oldest
    const filteredIds = finalFilteredLitters?.reverse().map((litter) => {
      return litter._id
    })

    setFilteredIds(filteredIds || [])
    
  }

  // Variable for error messages and content
  let content

  if (isLoading) content = <p>Loading...</p>
  if (isError) content = <p>{error?.data?.message}</p>

  if (isSuccess) {
    // Reverse original ids (without filters) to have newest come first
    const reversedNewIds = Object.values(litters?.entities)?.reverse().map((litter) => {
      return litter._id
    })

    const itemsPerPage = 50

    const maxPage = Math.ceil(filteredIds?.length ? filteredIds?.length / itemsPerPage : reversedNewIds?.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    // Litters to display on the current page
    const littersToDisplay = filteredIds?.length
      ? filteredIds.slice(startIndex, endIndex)
      : reversedNewIds.slice(startIndex, endIndex)

    const goToPageButtonDisabled = newPage < 1 || newPage > maxPage || parseInt(newPage) === currentPage

    // Litter component for each litter
    const tableContent = littersToDisplay.map(litterId => (
      <Litter key={litterId} litterId={litterId} />
    ))

    if (!reversedNewIds?.length) {
      return <>
        {userId?.length ? <><Link to={'/litters/new'}><button className="black-button">Add a New Litter</button></Link><br /><br /></> : null}
        <p>There are currently no litters in the database</p>
      </>
    }

    content = (
      <>
        {userId?.length ? <><Link to={'/litters/new'}><button className="black-button">Add a New Litter</button></Link><br /><br /></> : null}
        
        <button
          className="black-button"
          onClick={handleToggleFilterView}
        >
          Toggle Search View
        </button>

        <br />
        <br />

        <div id="litter-filter-div" style={{display: "none"}}>
          <p><b>Born at Earliest</b></p>
          <Calendar maxDate={bornLatest || new Date()} onChange={handleBornEarliestChanged} value={bornEarliest} />
          <button 
            className="black-button"
            disabled={bornEarliest === ''}
            style={bornEarliest === '' ? {backgroundColor: "grey", cursor: "default"} : null}
            onClick={() => setBornEarliest('')}
          >
            Clear Date
          </button>

          <br />
          <br />

          <p><b>Born at Latest</b></p>
          <Calendar minDate={bornEarliest || null} maxDate={new Date()} onChange={handleBornLatestChanged} value={bornLatest} />
          <button 
            className="black-button"
            disabled={bornLatest === ''}
            style={bornLatest === '' ? {backgroundColor: "grey", cursor: "default"} : null}
            onClick={() => setBornLatest('')}
          >
            Clear Date
          </button>

          <br />
          <br />

          <p><b>Lowest Amount of Puppies</b></p>
          <input 
            type="text"
            value={lowestPuppies}
            name="litter-lowest-puppies-search-input" 
            id="litter-lowest-puppies-search-input" 
            onChange={(e) => {
              if (PUPPIES_AMOUNT_REGEX.test(e.target.value) || e.target.value === '') {
                setLowestPuppies(e.target.value)}
              }
            }
          />

          <br />

          <p><b>Highest Amount of Puppies</b></p>
          <input 
            type="text"
            value={highestPuppies}
            name="litter-highest-puppies-search-input" 
            id="litter-highest-puppies-search-input" 
            onChange={(e) => {
              if (PUPPIES_AMOUNT_REGEX.test(e.target.value) || e.target.value === '') {
                setHighestPuppies(e.target.value)}
              }
            }
          />

          <br />
          <br />

          <button 
            onClick={handleSearchClicked}
            className="black-button search-button"
            disabled={lowestPuppies?.length && highestPuppies?.length && lowestPuppies > highestPuppies}
            style={lowestPuppies?.length && highestPuppies?.length 
              && lowestPuppies > highestPuppies ? {backgroundColor: "grey", cursor: "default"} : null
            }
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
            <tr>
              <th>Link</th>
              <th>Mother's Name</th>
              <th>Born</th>
            </tr>
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

export default LittersList

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

  const [bornEarliest, setBornEarliest] = useState('')

  const [bornLatest, setBornLatest] = useState('')

  const [puppies, setPuppies] = useState()

  const [filteredIds, setFilteredIds] = useState([])

  const [currentPage, setCurrentPage] = useState(1)

  const [newPage, setNewPage] = useState('')

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

    setCurrentPage(1)

    const finalBornEarliest = bornEarliest !== '' ? new Date(bornEarliest) : ''

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
  
    const filteredLittersPuppies = puppies?.length
      ? filteredLittersBornLatest?.filter((litter) => {
        return litter.children.toString() === puppies
      })
      : filteredLittersBornLatest

    const finalFilteredLitters = filteredLittersPuppies

    if (!finalFilteredLitters?.length) alert("Unfortunately, no matching litter has been found")

    const filteredIds = finalFilteredLitters?.reverse().map((litter) => {
      return litter._id
    })

    setFilteredIds(filteredIds || [])
    
  }

  // Variable for error messages and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const reversedNewIds = Object.values(litters?.entities)?.reverse().map((litter) => {
      return litter._id
    })

    const itemsPerPage = 50

    const maxPage = Math.ceil(filteredIds?.length ? filteredIds?.length / itemsPerPage : reversedNewIds?.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const littersToDisplay = filteredIds?.length
      ? filteredIds.slice(startIndex, endIndex)
      : reversedNewIds.slice(startIndex, endIndex)

    const goToPageButtonDisabled = newPage < 1 || newPage > maxPage || parseInt(newPage) === currentPage

    // Litter component for each litter
    const tableContent = littersToDisplay.map(litterId => (
      <Litter key={litterId} litterId={litterId} />
    ))

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
          <Calendar maxDate={new Date()} onChange={handleBornEarliestChanged} value={bornEarliest} />
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
          <Calendar maxDate={new Date()} onChange={handleBornLatestChanged} value={bornLatest} />
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

          <p><b>Amount of Puppies</b></p>
          <input 
            type="number"
            value={puppies}
            name="litter-puppies-search-input" 
            id="litter-puppies-search-input" 
            onChange={(e) => setPuppies(e.target.value)}
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

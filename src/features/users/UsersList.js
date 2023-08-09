import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"

const UsersList = () => {

  const [username, setUsername] = useState('')

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

    const filteredUsers = username?.length
      ? Object.values(users?.entities)?.filter((user) => {
        return user.username.includes(username)
      })
      : Object.values(users?.entities)

    if (!filteredUsers?.length) alert("Unfortunately, no matching user has been found")

    const filteredIds = filteredUsers?.reverse().map((user) => {
      return user._id
    })

    setFilteredIds(filteredIds || [])
    
  }

  // Variable for storing errors and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {

    const reversedNewIds = Object.values(users?.entities)?.reverse().map((user) => {
      return user._id
    })

    const itemsPerPage = 50

    const maxPage = Math.ceil(filteredIds?.length ? filteredIds?.length / itemsPerPage : reversedNewIds?.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

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

        <p><b>Search by Username</b></p>
        <input 
          type="text"
          value={username}
          name="user-username-search-input" 
          id="user-username-search-input" 
          onChange={(e) => setUsername(e.target.value)}
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

        <table className="content-table">
          <thead>
            <tr>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
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

export default UsersList

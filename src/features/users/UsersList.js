import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const UsersList = () => {

  const [username, setUsername] = useState('')

  const [filteredIds, setFilteredIds] = useState([])

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

    const filteredUsers = username?.length
      ? Object.values(users?.entities)?.filter((user) => {
        return user.username.includes(username)
      })
      : Object.values(users?.entities)

    if (!filteredUsers?.length) alert("Unfortunately, no matching user has been found")

    const filteredIds = filteredUsers?.map((user) => {
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
    const { ids } = users

    // User component for each user in the list
    const tableContent = filteredIds?.length
      ? filteredIds.map(userId => <User key={userId} userId={userId} />)
      : ids.map(userId => <User key={userId} userId={userId} />)

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
      </>
    )
  }

  return content
}

export default UsersList

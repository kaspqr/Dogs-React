import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"

const UsersList = () => {

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

  // Variable for storing errors and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = users

    // User component for each user in the list
    const tableContent = ids?.length
      ? ids.map(userId => <User key={userId} userId={userId} />)
      : null

    content = (
      <>
        <table className="content-table">
          <thead>
            <tr>
              <th>Username</th>
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

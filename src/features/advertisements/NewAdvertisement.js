import NewAdvertisementForm from './NewAdvertisementForm'
import { useGetUsersQuery } from "../users/usersApiSlice"
import { PulseLoader } from "react-spinners"

const NewAdvertisement = () => {

  // GET all the users with all of their .values
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!users?.length) return <PulseLoader color='#000' />

  const content = <NewAdvertisementForm users={users} />

  return content
}

export default NewAdvertisement

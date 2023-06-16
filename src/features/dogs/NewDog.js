import NewDogForm from './NewDogForm'
import { useGetUsersQuery } from "../users/usersApiSlice"
import { PulseLoader } from "react-spinners"

const NewDog = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!users?.length) return <PulseLoader color='#000' />

  const content = <NewDogForm users={users} />

  return content
}

export default NewDog

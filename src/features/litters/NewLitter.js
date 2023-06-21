import NewLitterForm from './NewLitterForm'
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useGetDogsQuery } from "../dogs/dogsApiSlice"
import { PulseLoader } from "react-spinners"

const NewLitter = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  const { dogs } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dogs: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!users?.length || !dogs?.length) return <PulseLoader color='#000' />

  const content = <NewLitterForm users={users} dogs={dogs} />

  return content
}

export default NewLitter

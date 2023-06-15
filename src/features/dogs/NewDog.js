import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersApiSlice"
import NewDogForm from './NewDogForm'

const NewDog = () => {
  const users = useSelector(selectAllUsers)

  if (!users?.length) return <p>Not Currently Available</p>

  const content = <NewDogForm users={users} />

  return content
}

export default NewDog

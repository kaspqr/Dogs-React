import { useSelector } from "react-redux"
import { selectAllUsers } from "../users/usersApiSlice"
import NewDogForm from './NewDogForm'

const NewDog = () => {
  const users = useSelector(selectAllUsers)

  const content = users ? <NewDogForm users={users} /> : <p>Loading...</p>

  return content
}

export default NewDog

import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectDogById } from "./dogsApiSlice"
import { selectAllUsers } from "../users/usersApiSlice"
import EditDogForm from './EditDogForm'

const EditDog = () => {
  const { id } = useParams()

  const dog = useSelector(state => selectDogById(state, id))
  const users = useSelector(selectAllUsers)

  const content = dog && users ? <EditDogForm dog={dog} users={users} /> : <p>Loading...</p>

  return content
}

export default EditDog

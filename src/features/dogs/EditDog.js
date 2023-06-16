import { useParams } from "react-router-dom"
import EditDogForm from './EditDogForm'
import { useGetDogsQuery } from "./dogsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from '../../hooks/useAuth'
import { PulseLoader } from "react-spinners"

const EditDog = () => {
  const { id } = useParams()

  const { isAdmin, isSuperAdmin, userId } = useAuth()

  const { dog } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dog: data?.entities[id]
    }),
  })

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!dog) console.log('no dog')

  if (!users?.length) console.log('no users length')

  if (!dog || !users?.length) return <PulseLoader color={'#000'} />

  if (!isAdmin && !isSuperAdmin) {
    if (dog.user !== userId) { // Need to change this to compare ids, not id and username
      return <p>No access</p>
    }
  }

  const content = <EditDogForm dog={dog} users={users} />

  return content
}

export default EditDog

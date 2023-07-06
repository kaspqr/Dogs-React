import { useParams } from "react-router-dom"
import EditAdvertisementForm from './EditAdvertisementForm'
import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from '../../hooks/useAuth'
import { PulseLoader } from "react-spinners"

const EditAdvertisement = () => {

  const { id } = useParams()

  const { userId } = useAuth()

  // GET the advertisement with all of it's .values
  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[id]
    }),
  })

  // GET all the users with all of their .values
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!advertisement) console.log('no advertisement')

  if (!users?.length) console.log('no users length')

  if (!advertisement || !users?.length) return <PulseLoader color={'#000'} />

  // If the user is not the poster, they are unauthorized to edit it
  if (advertisement.poster !== userId) { 
    return <p>No access</p>
  }

  const content = <EditAdvertisementForm advertisement={advertisement} users={users} />

  return content
}

export default EditAdvertisement

import { useParams } from "react-router-dom"
import EditAdvertisementForm from './EditAdvertisementForm'
import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from '../../hooks/useAuth'
import { PulseLoader } from "react-spinners"

const EditAdvertisement = () => {
  const { id } = useParams()

  const { userId } = useAuth()

  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[id]
    }),
  })

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map(id => data?.entities[id])
    }),
  })

  if (!advertisement) console.log('no advertisement')

  if (!users?.length) console.log('no users length')

  if (!advertisement || !users?.length) return <PulseLoader color={'#000'} />

  if (advertisement.poster !== userId) { 
    return <p>No access</p>
  }

  const content = <EditAdvertisementForm advertisement={advertisement} users={users} />

  return content
}

export default EditAdvertisement

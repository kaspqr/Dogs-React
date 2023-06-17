import { useParams } from "react-router-dom"
import EditUserForm from "./EditUserForm"
import { useGetUsersQuery } from "./usersApiSlice"
import { PulseLoader } from "react-spinners"
import useAuth from "../../hooks/useAuth"

const EditUser = () => {
  const { id } = useParams()
  const { userId } = useAuth()
  
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id]
    }),
  })

  if (!user) return <PulseLoader color="#000" />

  if (id !== userId) return <p>This is not your account</p>

  const content = <EditUserForm user={user} />

  return content
}

export default EditUser

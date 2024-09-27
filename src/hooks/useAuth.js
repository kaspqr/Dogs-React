import { useSelector } from "react-redux"
import { selectCurrentToken } from "../features/auth/auth-slices/authSlice"
import jwtDecode from "jwt-decode"

const useAuth = () => {
  const token = useSelector(selectCurrentToken)
  let isAdmin = false
  let isSuperAdmin = false
  let status = "User"

  if (token) {
    const decoded = jwtDecode(token)
    const { username, roles, id, active, name, email, image, bio, country, region } = decoded.UserInfo

    isAdmin = roles.includes('Admin')
    isSuperAdmin = roles.includes('SuperAdmin')

    if (isAdmin) status = "Admin"
    if (isSuperAdmin) status = "SuperAdmin"

    return { username, roles, status, isAdmin, isSuperAdmin, "userId": id, active, name, email, image, bio, country, region }
  }

  return { username: '', roles: [], isAdmin, isSuperAdmin, status }
}

export default useAuth

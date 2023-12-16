import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = () => {
  const location = useLocation()
  const { roles } = useAuth()

  if (!roles.length)
    return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}

export default RequireAuth

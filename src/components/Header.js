import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"

const Header = () => {
  const { userId } = useAuth()
  const navigate = useNavigate()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onLogoutClicked = () => sendLogout()

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  let navRight

  if (userId) {
    navRight = (
      <>
        <span className="nav-right header-link" onClick={onLogoutClicked}>Logout</span>
        <Link className="nav-right header-link" to={'/conversations'}>Messages</Link>
      </>
    )
  } else {
    navRight = (
      <>
        <Link className="nav-right header-link" to={'/register'}>Register</Link>
        <Link className="nav-right header-link" to={'/login'}>Login</Link>
      </>
    )
  }

  const content = (
    <header id="layout-header">
      <nav>
      <Link className="header-link" to={'/'}>Home</Link>
      <Link className="header-link" to={'/dogs'}>Dogs</Link>
      <Link className="header-link" to={'/users'}>Users</Link>
      <Link className="header-link" to={'/litters'}>Litters</Link>
        {navRight}
      </nav>
    </header>
  )

  return content
}

export default Header

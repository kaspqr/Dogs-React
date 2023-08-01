import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComments, faUser, faDoorOpen, faHouseChimney } from "@fortawesome/free-solid-svg-icons"

const Header = () => {

  const { userId } = useAuth()
  const navigate = useNavigate()

  // POST request to clear the refreshtoken
  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  // Go to homepage when logging out
  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onLogoutClicked = () => sendLogout()

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  // Variable for content varying on whether the user is logged in or not
  let navRight

  if (userId) {
    navRight = (
      <>
        <span className="nav-right header-link" onClick={onLogoutClicked}><FontAwesomeIcon icon={faDoorOpen} /></span>
        <Link className="nav-right header-link" to={`/users/${userId}`}><FontAwesomeIcon icon={faUser} /></Link>
        <Link className="nav-right header-link" to={'/conversations'}><FontAwesomeIcon icon={faComments} /></Link>
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
      <Link className="header-link" to={'/'}><FontAwesomeIcon icon={faHouseChimney} /></Link>
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

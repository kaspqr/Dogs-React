import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faDoorOpen } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"

const DASH_REGEX = /^\/(\/)?$/
const DOGS_REGEX = /^\/\/dogs(\/)?$/
const USERS_REGEX = /^\/\/users(\/)?$/

const Header = () => {
  const { userId } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

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

  let dashClass = null
  if (!DASH_REGEX.test(pathname) && !DOGS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    dashClass = "dash-header__container--small"
  }

  const logoutButton = (
    <button
      title="Logout"
      onClick={onLogoutClicked}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )

  const loginButton = (
    <button
      title="Login"
      onClick={() => navigate('/login')}
    >
      <FontAwesomeIcon icon={faDoorOpen} />
    </button>
  )

  const content = (
    <header>
      <div>
        <Link to="/">
          <h1>Dogs</h1>
        </Link>
        <nav>
          {userId ? logoutButton : loginButton}
        </nav>
      </div>
    </header>
  )

  return content
}

export default Header

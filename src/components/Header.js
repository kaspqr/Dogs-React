import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faDoorOpen, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
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
      <button
        title="Logout"
        className="nav-right"
        onClick={onLogoutClicked}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
    )
  } else {
    navRight = (
      <>
        <button
          title="Register"
          className="nav-right"
          onClick={() => navigate('/register')}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          title="Login"
          className="nav-right"
          onClick={() => navigate('/login')}
        >
          <FontAwesomeIcon icon={faDoorOpen} />
        </button>
      </>
    )
  }

  const content = (
    <header>
      <nav>
      <button
          title="Home"
          onClick={() => navigate('/')}
        >
          Dogs
        </button>
        {navRight}
      </nav>
    </header>
  )

  return content
}

export default Header

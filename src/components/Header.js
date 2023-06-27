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
        <button
          title="Logout"
          className="nav-right"
          onClick={onLogoutClicked}
        >
          Logout
        </button>
        <Link className="nav-right" to={'/conversations'}>
          Messages
        </Link>
      </>
    )
  } else {
    navRight = (
      <>
        <button
          title="Register"
          className="nav-right"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
        <button
          title="Login"
          className="nav-right"
          onClick={() => navigate('/login')}
        >
          Login
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
        Home
      </button>
      <Link to={'/dogs'}>Dogs</Link>
      <Link to={'/users'}>Users</Link>
      <Link to={'/litters'}>Litters</Link>
        {navRight}
      </nav>
    </header>
  )

  return content
}

export default Header

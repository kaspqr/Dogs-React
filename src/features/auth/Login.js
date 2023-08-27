import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import useAuth from "../../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons"

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const auth = useAuth()

  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  // POST method for auth (login)
  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    // Clear the error message if the username or password has changed
    setErrMsg('')
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (err) {
      console.log(err)
      if (!err.status) {
        setErrMsg('No Server Response')
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.status === 403) {
        setErrMsg('Account not verified. Please click the link in your email.')
      } else if (err.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg("Login failed. Make sure you have clicked on the verification link on the email you've provided. "
          + "If you haven't received the email, attempting to log in with an unverified account triggers a new "
          + "verification email being sent to you in case you have waited at least 1 hour since the last try."
        )
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  if (isLoading) return <p>Loading...</p>

  if (auth?.username?.length) {
    return <p>You are already logged in.</p>
  }

  const content = (
    <>
      <header>
        <p className="login-page-title">User Login</p>
      </header>

      <main>
        <p ref={errRef} aria-live="assertive">{errMsg}</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            <b>Username or Email</b>
          </label>
          <br />

          <input 
            className="three-hundred"
            type="text" 
            id="username"
            name="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <br />

          <label className="top-spacer" htmlFor="password">
            <b>Password</b>
          </label>
          <br />
          <input 
            className="three-hundred"
            name="password"
            type="password" 
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <br />
          <br />

          <label htmlFor="persist">
            <b>Stay Logged In </b>
            <FontAwesomeIcon name="persist" onClick={handleToggle} size="xl" icon={persist ? faToggleOn : faToggleOff} color={persist ? 'rgb(23, 152, 207)' : 'grey'} />
          </label>
          <br />
          <br />
          <button 
            type="submit"
            className="black-button three-hundred"
            disabled={!username?.length || !password?.length}
            style={!username?.length || !password?.length ? {backgroundColor: "grey", cursor: "default"} : null}
          >
            Sign In
          </button>

        </form>
        <br />
        <Link to={'/resetpassword'}>Forgot Password? Click here</Link>
      </main>
    </>
  )

  return content
}

export default Login

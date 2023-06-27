import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import useAuth from "../../hooks/useAuth"


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

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
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
      if (!err.status) {
        setErrMsg('No Server Response')
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password')
      } else if (err.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg(err.data?.message)
      }
      errRef.current.focus()
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const errClass = errMsg ? "errmsg" : "offscreen"

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
        <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            <b>Username:</b>
          </label>
          <br />
          <input 
            type="text" 
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <br />

          <label htmlFor="password">
            <b>Password:</b>
          </label>
          <br />
          <input 
            type="password" 
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <br />
          <br />

          <label htmlFor="persist">
            <b>Trust This Device:</b>
            <input 
              className="checkbox-to-the-right"
              type="checkbox" 
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
          </label>
          <br />
          <br />

          <button>Sign In</button>

        </form>
      </main>
    </>
  )

  return content
}

export default Login

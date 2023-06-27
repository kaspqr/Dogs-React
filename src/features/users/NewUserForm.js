import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const USERNAME_REGEX = /^[A-z]{6,20}$/
const NAME_REGEX = /^[A-z]{2,20}$/
const EMAIL_REGEX = /^[A-z0-9@.]{7,50}$/
const LOCATION_REGEX = /^[A-z]{4,50}$/
const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/

const NewUserForm = () => {

    const auth = useAuth()

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()


    const navigate = useNavigate()


    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

    const [location, setLocation] = useState('')
    const [validLocation, setValidLocation] = useState(false)


    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidName(NAME_REGEX.test(name))
    }, [name])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidLocation(LOCATION_REGEX.test(location))
    }, [location])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setName('')
            setEmail('')
            setLocation('')
            navigate('/users')
        }
    }, [isSuccess, navigate])


    const handleUsernameChanged = e => setUsername(e.target.value)
    const handlePasswordChanged = e => setPassword(e.target.value)
    const handleNameChanged = e => setName(e.target.value)
    const handleEmailChanged = e => setEmail(e.target.value)
    const handleLocationChanged = e => setLocation(e.target.value)

    const canSave = [validUsername, validPassword, validName, validEmail, validLocation].every(Boolean) && !isLoading

    const handleSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, password, name, email, location })
        }
    }

    const errClass = isError ? "errmsg" : "offscreen"

    if (auth?.username?.length) {
        return <p>You are currently logged in. Please logout before registering a new user.</p>
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form onSubmit={handleSaveUserClicked}>
                <div>
                    <p className="register-page-title">Register New Account</p>
                    <div className="register-page-button-div">
                        <button
                            title="Save"
                            disabled={!canSave}
                        >
                            Register
                        </button>
                    </div>
                </div>
                
                <label htmlFor="username">
                    <b>Username: [6-20 letters]</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="username"
                    name="username"
                    autoComplete="off"
                    value={username}
                    onChange={handleUsernameChanged}
                />
                <br />

                <label htmlFor="password">
                    <b>Password: [8-20 characters, including !@#%]</b>
                </label>
                <br />
                <input 
                    type="password" 
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChanged}
                />
                <br />

                <label htmlFor="email">
                    <b>Email:</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChanged}
                />
                <br />

                <label htmlFor="name">
                    <b>Name:</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleNameChanged}
                />
                <br />

                <label htmlFor="location">
                    <b>Location:</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={location}
                    onChange={handleLocationChanged}
                />
            </form>
        </>
    )

    return content
}

export default NewUserForm

import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const NAME_REGEX = /^[A-z]{2,20}$/
const EMAIL_REGEX = /^[A-z0-9@.]{7,50}$/
const LOCATION_REGEX = /^[A-z]{4,50}$/
const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/


const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()


    const navigate = useNavigate()


    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)

    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)

    const [location, setLocation] = useState('')
    const [validLocation, setValidLocation] = useState(false)

    const [active, setActive] = useState(user.active)

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
        if (isSuccess || isDelSuccess) {
            setPassword('')
            setName('')
            setEmail('')
            setLocation('')
            navigate('/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const handlePasswordChanged = e => setPassword(e.target.value)
    const handleNameChanged = e => setName(e.target.value)
    const handleEmailChanged = e => setEmail(e.target.value)
    const handleLocationChanged = e => setLocation(e.target.value)

    const handleActiveChanged = () => setActive(prev => !prev)

    const handleSaveUserClicked = async () => {
        if (password) {
            await updateUser({ id: user.id, password, name, email, location, active })
        } else {
            await updateUser({ id: user.id, name, email, location, active })
        }
    }

    const handleDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave

    if (password) {
        canSave = [validPassword, validName, validEmail, validLocation].every(Boolean) && !isLoading
    } else {
        canSave = [validName, validEmail, validLocation].every(Boolean) && !isLoading
    }

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p>{errContent}</p>

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <h2>Edit Profile</h2>
                    <div>
                        <button
                            title="Save"
                            onClick={handleSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            title="Delete"
                            onClick={handleDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label htmlFor="password">Password: [8-20 characters, including !@#%]</label>
                <input 
                    type="password" 
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChanged}
                />

                <label htmlFor="email">
                    Email:
                </label>
                <input 
                    type="text" 
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChanged}
                />

                <label htmlFor="name">
                    Name:
                </label>
                <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleNameChanged}
                />

                <label htmlFor="location">
                    Location:
                </label>
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={location}
                    onChange={handleLocationChanged}
                />

                <label htmlFor="user-active">
                    Active:
                </label>
                <input 
                    type="checkbox"
                    checked={active} 
                    id="user-active"
                    name="user-active"
                    onChange={handleActiveChanged}
                />
            </form>
        </>
    )

  return content
}

export default EditUserForm


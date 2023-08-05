import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"

const EditUserForm = ({ user }) => {

    // PATCH function for updating the user
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    // DELETE function for deleting the user
    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()


    const navigate = useNavigate()


    const [password, setPassword] = useState('')

    const [name, setName] = useState(user.name)

    const [email, setEmail] = useState(user.email)

    const [location, setLocation] = useState(user.location)

    // Clear the inputs if the user has been updated or deleted successfully
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

    // PATCH the user
    const handleSaveUserClicked = async () => {
        if (password) {
            await updateUser({ id: user.id, password, name, email, location })
        } else {
            await updateUser({ id: user.id, name, email, location })
        }
    }

    // DELETE the user
    const handleDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
        navigate('/')
    }

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <p>{errContent}</p>

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <p className="edit-profile-page-title">Edit Profile</p>
                </div>
                <label htmlFor="password">
                    <b>Password [8-20 characters, including !@#%]</b>
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
                <br />

                <label htmlFor="email">
                    <b>Email</b>
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
                <br />

                <label htmlFor="name">
                    <b>Name</b>
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
                <br />

                <label htmlFor="location">
                    <b>Location</b>
                </label>
                <br />
                <input 
                    type="text" 
                    id="location"
                    name="location"
                    value={location}
                    onChange={handleLocationChanged}
                />
                <br />
                <br />
                
                <div className="edit-profile-buttons-div">
                    <button
                        className="black-button"
                        title="Save"
                        onClick={handleSaveUserClicked}
                    >
                        Save
                    </button>
                    <button
                        title="Delete"
                        onClick={handleDeleteUserClicked}
                        className="edit-profile-delete-button black-button"
                    >
                        Delete
                    </button>
                </div>
            </form>
        </>
    )

  return content
}

export default EditUserForm


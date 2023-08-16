import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useSendLogoutMutation } from "../auth/authApiSlice"
import { useNavigate } from "react-router-dom"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"

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
        isLoading: isDelLoading,
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    // POST request to clear the refreshtoken
    const [sendLogout, {
        isLoading: isLogoutLoading,
        isSuccess: isLogoutSuccess,
        isError: isLogoutError,
        error: logoutError
    }] = useSendLogoutMutation()

    const navigate = useNavigate()

    const NAME_REGEX = /^(?=.{1,30}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/

    const [password, setPassword] = useState('')

    const [confirmPassword, setConfirmPassword] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')

    const [name, setName] = useState(user.name)

    const [email, setEmail] = useState(user.email)

    const [country, setCountry] = useState(user.country)

    const [region, setRegion] = useState(user.region?.length ? user.region : '')

    const [changePasswordError, setChangePasswordError] = useState('')

    // Clear the inputs if the user has been updated or deleted successfully
    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setPassword('')
            setConfirmPassword('')
            setName('')
            setEmail('')
            setCountry('')
            setRegion('')
            navigate('/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const handlePasswordChanged = e => setPassword(e.target.value)
    const handleConfirmPasswordChanged = e => setConfirmPassword(e.target.value)
    const handleCurrentPasswordChanged = e => setCurrentPassword(e.target.value)
    const handleNameChanged = e => setName(e.target.value)
    const handleEmailChanged = e => setEmail(e.target.value)

    const handleCountryChanged = e => {
        setRegion('none ')
        setCountry(e.target.value)
    }

    // PATCH the user
    const handleSaveUserClicked = async () => {
        setChangePasswordError('')
        if (password?.length) {
            if (password !== confirmPassword) {
                setChangePasswordError(<>New Password doesn't match with Confirm Password</>)
            }
            await updateUser({ id: user.id, password, name, email, country, region, currentPassword })
        } else {
            await updateUser({ id: user.id, name, email, country, region, currentPassword })
        }
    }

    // DELETE the user
    const handleDeleteUserClicked = async () => {
        const response = await deleteUser({ id: user.id, currentPassword })

        if (!response?.error) {
            sendLogout()
        }
    }

    useEffect(() => {
        if (isLogoutSuccess) navigate('/')
    }, [isLogoutSuccess, navigate])

    if (isLoading || isDelLoading || isLogoutLoading) return <p>Loading...</p>

    const errContent = isError 
        ? error?.data?.message
        : isDelError
            ? delerror?.data?.message 
            : isLogoutError
                ? logoutError
                : ''

    const canSave = currentPassword?.length && NAME_REGEX.test(name) && EMAIL_REGEX.test(email)
        && ((!password?.length && !confirmPassword?.length) || (PASSWORD_REGEX.test(password) && password === confirmPassword))

    const content = (
        <>
            {changePasswordError?.length ? <p>{changePasswordError}</p> : null}
            {errContent?.length ? <p>{errContent}</p> : null}

            <form onSubmit={e => e.preventDefault()}>
                <div>
                    <p className="edit-profile-page-title">Edit Profile</p>
                </div>

                <p>Fields marked with <b>*</b> are required</p>
                <br />

                <label htmlFor="current-password">
                    <b>Current Password*</b>
                </label>
                <br />
                <input 
                    type="password" 
                    id="current-password"
                    name="current-password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChanged}
                />
                <br />
                <br />

                <label htmlFor="password">
                    <b>New Password (8-20 characters, including !@#%)</b>
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

                <label htmlFor="confirm-password">
                    <b>Confirm New Password</b>
                </label>
                <br />
                <input 
                    type="password" 
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChanged}
                />
                <br />
                <br />

                <label htmlFor="email">
                    <b>Email*</b>
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
                    <b>Name (Max. 30 Letters)*</b>
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

                <label htmlFor="country">
                    <b>Country*</b>
                </label>
                <br />
                <select 
                    type="text" 
                    id="country"
                    name="country"
                    value={country}
                    onChange={handleCountryChanged}
                >
                    {Countries}
                </select>
                <br />
                <br />

                <label htmlFor="region">
                    <b>Region</b>
                </label>
                <br />
                <select 
                    disabled={!bigCountries?.includes(country)}
                    name="region" 
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    <option value="none ">Region (optional)</option>
                    {bigCountries?.includes(country) ? Regions[country] : null}
                </select>
                <br />
                <br />
                
                <div className="edit-profile-buttons-div">
                    <button
                        className="black-button"
                        title="Save"
                        disabled={!canSave}
                        style={!canSave ? {backgroundColor: "grey", cursor: "default"} : null}
                        onClick={handleSaveUserClicked}
                    >
                        Save
                    </button>
                    <button
                        title="Delete"
                        onClick={handleDeleteUserClicked}
                        disabled={!currentPassword?.length}
                        style={!currentPassword?.length ? {backgroundColor: "grey", cursor: "default"} : null}
                        className="edit-profile-delete-button black-button"
                    >
                        Delete Account
                    </button>
                </div>
            </form>
        </>
    )

  return content
}

export default EditUserForm


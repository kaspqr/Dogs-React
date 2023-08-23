import { useNavigate, useParams } from "react-router-dom"
import { useGetTokensQuery } from "./tokensApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from "../../hooks/useAuth"

// Verify email query instead ??

const EmailVerify = () => {

    const { userId } = useAuth()

    const navigate = useNavigate()
    const params = useParams()

    // GET the user whose page we're on with all of it's .values
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[params.id]
        }),
    })

    // GET the user whose page we're on with all of it's .values
    const { token } = useGetTokensQuery("tokensList", {
        selectFromResult: ({ data }) => ({
            token: data?.entities[params.token]
        }),
    })

    const successMsg = <>
        <h1>Email Verified Successfully</h1>
        <button onClick={() => navigate('/login')} className="black-button">Login</button>
    </>

    if (userId?.length) {
        return <h1>Please logout before verifying an account</h1>
    }

    if (user?.verified === true) {
        return <>
            <h1>This account has already been verified</h1>
            <button onClick={() => navigate('/login')} className="black-button">Login</button>
        </>
    }
    if (!user?.id?.length && !token?.id?.length) return <h1>Invalid Link</h1>

    const verifyEmailUrl = async () => {
        try {
            const response = await fetch(`http://localhost:3500/users/${params.id}/verify/${params.token}`)

            if (response.status === 200) {
                return successMsg
            }
        } catch (error) {
            console.log(error)
        }
    }

    verifyEmailUrl()

    return successMsg
}

export default EmailVerify

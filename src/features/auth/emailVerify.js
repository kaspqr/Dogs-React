import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const EmailVerify = () => {

    const [validUrl, setValidUrl] = useState(false)

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const response = await fetch(`http://localhost:3500/users/${params.id}/verify/${params.token}`)

                console.log(response.status)
                if (response.status === 200) {
                    setValidUrl(true)
                }
            } catch (error) {
                console.log(error)
            }
        }

        verifyEmailUrl()
    }, [params])

    return (
        <>
            {validUrl 
                ? <>
                    <h1>Email Verified Successfully</h1>
                    <button onClick={() => navigate('/login')} className="black-button">Login</button>
                </>
                : <h1>404 Not Found</h1>
            }
        </>
    )
}

export default EmailVerify

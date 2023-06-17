import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Footer = () => {

  const { username, status } = useAuth()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onGoHomeClicked = () => navigate('/')

  let goHomeButton = null
  if (pathname !== '/') {
    goHomeButton = (
        <button 
            className="dash-footer__button icon-button"
            title="Home"
            onClick={onGoHomeClicked}
            
        >
        <FontAwesomeIcon icon={faHouse} />
        </button>

    )
  }

  const content = (
    <footer className="footer">
        {goHomeButton}
        <p>Current User: {username}</p>
        {status === "Admin" || status === "SuperAdmin" ? <p>Status: {status}</p> : null}
    </footer>
  )

  return content
}

export default Footer

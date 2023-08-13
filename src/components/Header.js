import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComments, faUser, faDoorOpen, faHouseChimney, faFlag, faClipboardUser, faBars } from "@fortawesome/free-solid-svg-icons"

const Header = () => {

  const { userId, isAdmin, isSuperAdmin } = useAuth()

  const navigate = useNavigate()

  const [dropdownVisible, setDropdownVisible] = useState(false)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const onBarsClicked = () => {
    {dropdownVisible === false 
      ? document.getElementById('content').style.display = 'none' 
      : document.getElementById('content').style.display = 'grid'
    }
    setDropdownVisible(dropdownVisible === false ? true : false)
  }

  const onMobileLinkClicked = () => {
    document.getElementById('content').style.display = 'grid'
    setDropdownVisible(false)
  }

  // POST request to clear the refreshtoken
  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  // Go to homepage when logging out
  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  const onLogoutClicked = () => {
    sendLogout()
    if (!windowWidth > 600) {
      onMobileLinkClicked()
    }
  }

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  // Variable for content varying on whether the user is logged in or not, for screens wider than 600px
  let navRight

  // Variable for content varying on whether the user is logged in or not, for screens narrower than 600px
  let dropdown

  if (userId) {
    navRight = <>
        <span 
          className="nav-right header-link header-hover" 
          onClick={onLogoutClicked}
        >
          <FontAwesomeIcon icon={faDoorOpen} />
        </span>

        <Link 
          className="nav-right header-link header-hover" 
          to={`/users/${userId}`}
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>

        <Link 
          className="nav-right header-link header-hover" 
          to={'/conversations'}
        >
          <FontAwesomeIcon icon={faComments} />
        </Link>

        {isAdmin || isSuperAdmin
          ? <span>
                <Link 
                  className="nav-right header-link header-hover" 
                  to={'/adminpage'}
                >
                  <FontAwesomeIcon icon={faFlag} />
                </Link>
            </span> 
          : null
        }
      </>
    
    dropdown = <>
        <span onClick={onBarsClicked} className="nav-right header-link header-hover">
          <FontAwesomeIcon icon={faBars} />
        </span>

        <div style={dropdownVisible === true ? null : {display: "none"}} className="dropdown-links">
          {isAdmin || isSuperAdmin
            ? <Link 
                className="nav-dropdown header-link header-hover" 
                to={'/adminpage'}
                onClick={onMobileLinkClicked}
              >
                <p>Admin Panel</p>
              </Link>
            : null
          }

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/conversations'}
            onClick={onMobileLinkClicked}
          >
            <p>Conversations</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={`/users/${userId}`}
            onClick={onMobileLinkClicked}
          >
            <p>My Profile</p>
          </Link>

          <a 
            className="nav-dropdown header-link header-hover" 
            onClick={onLogoutClicked}
          >
            <p>Logout</p>
          </a>

        </div>
      </>
  } else {
    navRight = <>
      <Link className="nav-right header-link header-hover" to={'/register'}>
        <FontAwesomeIcon icon={faClipboardUser} />
      </Link>

      <Link className="nav-right header-link header-hover" to={'/login'}>
        <FontAwesomeIcon icon={faDoorOpen} />
      </Link>
    </>

    dropdown = <>
        <span 
          onClick={onBarsClicked} 
          className="nav-right header-link header-hover"
        >
          <FontAwesomeIcon icon={faBars} />
        </span>

        <div style={dropdownVisible === true ? null : {display: "none"}} className="dropdown-links">
          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/login'}
            onClick={onMobileLinkClicked}
          >
            <p>Login</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/register'}
            onClick={onMobileLinkClicked}
          >
            <p>Register</p>
          </Link>

        </div>
      </>
  }

  const content = (
    <header style={dropdownVisible === true ? {position: "fixed", width: "100%"} : null} id="layout-header"> 
      <nav>
        <Link 
          className="header-link header-hover" 
          to={'/'}
          onClick={windowWidth > 600 ? null : onMobileLinkClicked}
        >
          <FontAwesomeIcon icon={faHouseChimney} />
        </Link>

        <Link 
          className="header-link orange-background" 
          to={'/dogs'}
          onClick={windowWidth > 600 ? null : onMobileLinkClicked}
        >
          Dogs
        </Link>

        <Link 
          className="header-link orange-background" 
          to={'/litters'}
          onClick={windowWidth > 600 ? null : onMobileLinkClicked}
        >
          Litters
        </Link>

        <Link 
          className="header-link orange-background" 
          to={'/users'}
          onClick={windowWidth > 600 ? null : onMobileLinkClicked}
        >
          Users
        </Link>

        {windowWidth > 600 ? navRight : dropdown}

      </nav>
    </header>
  )

  return content
}

export default Header

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComments, faUser, faDoorOpen, faFlag, faClipboardUser, faBars, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import HomeIcon from "../config/images/HomeIcon.png"

const Header = () => {

  const { userId, isAdmin, isSuperAdmin } = useAuth()

  const navigate = useNavigate()

  // State for switching between desktop and mobile content
  const [dropdownVisible, setDropdownVisible] = useState(false)

  // State for checking how wide is the user's screen
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Function for handling the resizing of screen
  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  // Always check if a window is being resized
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (windowWidth > 600 && dropdownVisible === true) {
      document.getElementById('content').style.display = 'grid'
      setDropdownVisible(false)
    }
  }, [windowWidth, dropdownVisible])

  // Function for displaying dropdown menu
  const onBarsClicked = () => {
    {dropdownVisible === false 
      ? document.getElementById('content').style.display = 'none' 
      : document.getElementById('content').style.display = 'grid'
    }
    setDropdownVisible(dropdownVisible === false ? true : false)
  }

  // Remove the mobile screen's dropdown menu once the user has clicked on a link in the menu
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
    if (windowWidth <= 600) {
      onMobileLinkClicked()
    }
  }

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  // Variable for content varying on whether the user is logged in or not, for screens wider than 600px
  let navRight

  // Variable for content varying on whether the user is logged in or not, for screens narrower than 600px
  let dropdown

  // If logged in
  if (userId) {
    // Contents of desktop menu
    navRight = <span className="nav-right-span">
        {isAdmin || isSuperAdmin
          ? <span>
                <Link 
                  className="header-link header-hover" 
                  to={'/adminpage'}
                >
                  <FontAwesomeIcon icon={faFlag} />
                </Link>
            </span> 
          : null
        }

        <Link 
          className="header-link header-hover" 
          to={'/faq'}
        >
          <FontAwesomeIcon icon={faCircleQuestion} />
        </Link>

        <Link 
          className="header-link header-hover" 
          to={'/conversations'}
        >
          <FontAwesomeIcon icon={faComments} />
        </Link>

        <Link 
          className="header-link header-hover" 
          to={`/users/${userId}`}
        >
          <FontAwesomeIcon icon={faUser} />
        </Link>

        <span 
          className="header-link header-hover" 
          onClick={onLogoutClicked}
        >
          <FontAwesomeIcon icon={faDoorOpen} />
        </span>

      </span>
    
    // Contents of mobile menu
    dropdown = <>
        <span onClick={onBarsClicked} className="nav-right-span header-link header-hover">
          <FontAwesomeIcon icon={faBars} className="menu-icons" />
        </span>

        <div style={dropdownVisible === true ? null : {display: "none"}} className="dropdown-links">

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/conversations'}
            onClick={onMobileLinkClicked}
          >
            <p>Inbox</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/dogs'}
            onClick={onMobileLinkClicked}
          >
            <p>Dogs</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/litters'}
            onClick={onMobileLinkClicked}
          >
            <p>Litters</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/users'}
            onClick={onMobileLinkClicked}
          >
            <p>Users</p>
          </Link>

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
            to={`/users/${userId}`}
            onClick={onMobileLinkClicked}
          >
            <p>My Profile</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/faq'}
            onClick={onMobileLinkClicked}
          >
            <p>FAQ</p>
          </Link>

          <a 
            className="nav-dropdown header-link header-hover" 
            onClick={onLogoutClicked}
          >
            <p>Logout</p>
          </a>

        </div>
      </>
  } else { // If not logged in
    // Contents of desktop menu
    navRight = <span className="nav-right-span">
      <Link className="header-link header-hover" to={'/faq'}>
        <FontAwesomeIcon icon={faCircleQuestion} />
      </Link>

      <Link className="header-link header-hover" to={'/register'}>
        <FontAwesomeIcon icon={faClipboardUser} />
      </Link>

      <Link className="header-link header-hover" to={'/login'}>
        <FontAwesomeIcon icon={faDoorOpen} />
      </Link>
    </span>

    // Contents of mobile menu
    dropdown = <>
        <span 
          onClick={onBarsClicked} 
          className="nav-right-span header-link header-hover"
        >
          <FontAwesomeIcon icon={faBars} className="menu-icons" />
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

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/dogs'}
            onClick={onMobileLinkClicked}
          >
            <p>Dogs</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/litters'}
            onClick={onMobileLinkClicked}
          >
            <p>Litters</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/users'}
            onClick={onMobileLinkClicked}
          >
            <p>Users</p>
          </Link>

          <Link 
            className="nav-dropdown header-link header-hover" 
            to={'/faq'}
            onClick={onMobileLinkClicked}
          >
            <p>FAQ</p>
          </Link>

        </div>
      </>
  }

  // Final content to be returned
  const content = (
    <header style={dropdownVisible === true ? {position: "fixed", width: "100%"} : null} id="layout-header"> 
      <nav id="header-nav">
        <Link 
          className="header-link header-hover" 
          to={'/'}
          onClick={windowWidth > 600 ? null : onMobileLinkClicked}
        >
          <img width="50" height="50" src={HomeIcon} alt="Home" />
        </Link>

        {windowWidth > 600 
          ? <><Link 
            className="header-link orange-background" 
            to={'/dogs'}
          >
            Dogs
          </Link>

          <Link 
            className="header-link orange-background" 
            to={'/litters'}
          >
            Litters
          </Link>

          <Link 
            className="header-link orange-background" 
            to={'/users'}
          >
            Users
          </Link></>

          : null
        }

        {windowWidth > 600 ? navRight : dropdown}

      </nav>
    </header>
  )

  return content
}

export default Header

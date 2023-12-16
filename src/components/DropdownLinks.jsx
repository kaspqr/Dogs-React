import React from 'react'
import { Link } from 'react-router-dom'

import useAuth from '../hooks/useAuth'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

const DropdownLinks = ({ dropdownVisible, onMobileLinkClicked, onBarsClicked, onLogoutClicked }) => {
  const { userId, isAdmin, isSuperAdmin } = useAuth()

  if (userId) return (
    <>
      <span onClick={onBarsClicked} className="nav-right-span header-link header-hover">
        <FontAwesomeIcon icon={faBars} className="menu-icons" />
      </span>
      <div style={dropdownVisible ? null : { display: "none" }} className="dropdown-links">
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
        <span
          className="nav-dropdown header-link header-hover"
          onClick={onLogoutClicked}
        >
          <p>Logout</p>
        </span>
      </div>
    </>
  )

  return (
    <>
      <span
        onClick={onBarsClicked}
        className="nav-right-span header-link header-hover"
      >
        <FontAwesomeIcon icon={faBars} className="menu-icons" />
      </span>
      <div style={dropdownVisible ? null : { display: "none" }} className="dropdown-links">
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
  )
}

export default DropdownLinks

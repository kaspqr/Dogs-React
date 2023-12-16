import React from 'react'
import { Link } from 'react-router-dom'

import useAuth from '../hooks/useAuth'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faComments,
  faUser,
  faDoorOpen,
  faFlag,
  faClipboardUser,
  faCircleQuestion
} from "@fortawesome/free-solid-svg-icons"

const NavRight = ({ onLogoutClicked }) => {
  const { userId, isAdmin, isSuperAdmin } = useAuth()

  if (userId) return (
    <span className="nav-right-span">
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
  )

  return (
    <span className="nav-right-span">
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
  )
}

export default NavRight

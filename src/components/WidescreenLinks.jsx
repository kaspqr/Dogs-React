import React from 'react'
import { Link } from 'react-router-dom'

const WidescreenLinks = () => {
  return (
    <>
      <Link
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
      </Link>
    </>
  )
}

export default WidescreenLinks

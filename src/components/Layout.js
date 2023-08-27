import { Outlet } from "react-router-dom"
import Header from "./Header"
import useAuth from "../hooks/useAuth"
import { useGetUsersQuery } from "../features/users/usersApiSlice"

const Layout = () => {

  function adjustWidthForScrollbar() {
    const hasScrollbar = window.innerWidth > document.documentElement.clientWidth
    const adjustedWidth = hasScrollbar ? `calc(100vw - ${window.innerWidth - document.documentElement.clientWidth}px)` : '100vw'
  
    const elementsToAdjust = document.querySelectorAll('#content')
    elementsToAdjust.forEach(element => {
      element.style.width = adjustedWidth
    })
  }
    
  // Call the function initially and when the window is resized
  adjustWidthForScrollbar()
  window.addEventListener('resize', adjustWidthForScrollbar)

  const { userId } = useAuth()

  // GET the current user with all of it's .values
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
        user: data?.entities[userId]
    }),
  })

  return (
    <>
      <Header />
      <div id="content" className="content">
        <div></div>
        <div>
          {!userId?.length || user?.active === true
            ? <Outlet />
            : <p>You account has been banned.</p>
          }
        </div>
        <div></div>
      </div>
    </>
  )
}

export default Layout

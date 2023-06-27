import { Outlet } from "react-router-dom"
import Header from "./Header"

const Layout = () => {
  return (
    <>
      <Header />
      <div className="content">
        <div></div>
        <div>
          <Outlet />
        </div>
        <div></div>
      </div>
    </>
  )
}

export default Layout

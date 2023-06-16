import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import DogsList from "./features/dogs/DogsList"
import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import EditDog from "./features/dogs/EditDog"
import NewDog from "./features/dogs/NewDog"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from './config/roles'
import useTitle from "./hooks/useTitle"

function App() {

  useTitle('Dogs App')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
                </Route>

                <Route path="dogs">
                  <Route index element={<DogsList />} />
                  <Route path=":id" element={<EditDog />} />
                  <Route path="new" element={<NewDog />} />
                </Route>
              </Route>{/*End dash*/}
            </Route>
          </Route>
        </Route>{/* End protected routes */}
      </Route>
    </Routes>
  )
}

export default App

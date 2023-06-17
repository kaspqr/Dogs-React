import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./features/auth/Login"
import Welcome from "./features/auth/Welcome"

import DogsList from "./features/dogs/DogsList"
import EditDog from "./features/dogs/EditDog"
import NewDog from "./features/dogs/NewDog"

import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import UserPage from "./features/users/UserPage"

import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from './config/roles'
import useTitle from "./hooks/useTitle"

function App() {

  useTitle('Dogs App')

  return (
    <Routes>

        <Route element={<Prefetch />}>

          <Route path="/" element={<Layout />}>

            <Route index element={<Welcome />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<NewUserForm />} />
            <Route path="users">

              <Route index element={<UsersList />} />
              <Route path=":id" element={<UserPage />} />
              <Route element={<PersistLogin />}>

                <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>

                  <Route path="edit/:id" element={<EditUser />} />
                </Route>
              </Route>
            </Route>

            <Route path="dogs">

              <Route index element={<DogsList />} />
              <Route element={<PersistLogin />}>
                <Route path=":id" element={<EditDog />} />
                <Route path="new" element={<NewDog />} />
              </Route>
            </Route>
          </Route>
        </Route>
    </Routes>
  )
}

export default App

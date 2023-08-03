import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./features/auth/Login"

import DogsList from "./features/dogs/DogsList"
import EditDog from "./features/dogs/EditDog"
import NewDog from "./features/dogs/NewDog"
import DogPage from "./features/dogs/DogPage"

import UsersList from "./features/users/UsersList"
import EditUser from "./features/users/EditUser"
import NewUserForm from "./features/users/NewUserForm"
import UserPage from "./features/users/UserPage"

import LittersList from "./features/litters/LittersList"
import NewLitter from "./features/litters/NewLitter"
import LitterPage from "./features/litters/LitterPage"

import AdvertisementsList from "./features/advertisements/AdvertisementsList"
import EditAdvertisement from "./features/advertisements/EditAdvertisement"
import NewAdvertisement from "./features/advertisements/NewAdvertisement"
import AdvertisementPage from "./features/advertisements/AdvertisementPage"

import ConversationsList from "./features/conversations/ConversationsList"
import ConversationPage from "./features/conversations/ConversationPage"

import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import useTitle from "./hooks/useTitle"

import DogReportPage from "./features/dogreports/DogReportPage"
import AdvertisementReportPage from "./features/advertisementreports/AdvertisementReportPage"
import UserReportPage from "./features/userreports/UserReportPage"
import MessageReportPage from "./features/messagereports/MessageReportPage"

import AdminPage from "./features/adminpage/AdminPage"

import AdvertisementReportsList from "./features/adminpage/AdvertisementReportsList"
import ReportedAdvertisementPage from "./features/adminpage/ReportedAdvertisementPage"

import DogReportsList from "./features/adminpage/DogReportsList"
import ReportedDogPage from "./features/adminpage/ReportedDogPage"

import MessageReportsList from "./features/adminpage/MessageReportsList"
import ReportedMessagePage from "./features/adminpage/ReportedMessagePage"

import UserReportsList from "./features/adminpage/UserReportsList"
import ReportedUserPage from "./features/adminpage/ReportedUserPage"

function App() {

  useTitle('Dogs App')

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route element={<Prefetch />}>
          <Route path="/" element={<Layout />}>

            <Route index element={<AdvertisementsList />} />
            <Route path="advertisements/:advertisementid" element={<AdvertisementPage />} />
            <Route element={<RequireAuth />}>
              <Route path="advertisements/edit/:id" element={<EditAdvertisement />} />
              <Route path="advertisements/new" element={<NewAdvertisement />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<NewUserForm />} />


            <Route path="users">

              <Route index element={<UsersList />} />
              <Route path=":id" element={<UserPage />} />

                <Route element={<RequireAuth />}>
                  <Route path="edit/:id" element={<EditUser />} />
                </Route>
            </Route>


            <Route path="dogs">

              <Route index element={<DogsList />} />
              <Route path=":dogid" element={<DogPage />} />

              <Route element={<RequireAuth />}>
                <Route path="edit/:id" element={<EditDog />} />
                <Route path="new" element={<NewDog />} />
              </Route>
            </Route>


            <Route path="litters">

              <Route index element={<LittersList />} />
              <Route path=":litterid" element={<LitterPage />} />

              <Route element={<RequireAuth />}>
                <Route path="new" element={<NewLitter />} />
              </Route>
            </Route>


            <Route element={<RequireAuth />}>

              <Route path="conversations">
                <Route index element={<ConversationsList />} />
                <Route path=":conversationid" element={<ConversationPage />} />
              </Route>
            </Route>


            <Route element={<RequireAuth />}>
              <Route path="reportdog/:dogid" element={<DogReportPage />} />
            </Route>


            <Route element={<RequireAuth />}>
              <Route path="reportadvertisement/:advertisementid" element={<AdvertisementReportPage />} />
            </Route>


            <Route element={<RequireAuth />}>
              <Route path="reportuser/:userid" element={<UserReportPage />} />
            </Route>


            <Route element={<RequireAuth />}>
              <Route path="reportmessage/:messageid" element={<MessageReportPage />} />
            </Route>


            <Route element={<RequireAuth />}>
              <Route path="adminpage" element={<AdminPage />} />
            </Route>


            <Route path="advertisementreports">

              <Route index element={<AdvertisementReportsList />} />
              <Route path=":advertisementreportid" element={<ReportedAdvertisementPage />} />
            </Route>


            <Route path="dogreports">

              <Route index element={<DogReportsList />} />
              <Route path=":dogreportid" element={<ReportedDogPage />} />
            </Route>


            <Route path="messagereports">

              <Route index element={<MessageReportsList />} />
              <Route path=":messagereportid" element={<ReportedMessagePage />} />
            </Route>


            <Route path="userreports">

              <Route index element={<UserReportsList />} />
              <Route path=":userreportid" element={<ReportedUserPage />} />
            </Route>

            
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";

import DogsList from "./features/dogs/DogsList";
import EditDog from "./features/dogs/edit-dog/EditDog";
import NewDogForm from "./features/dogs/create-dog/NewDogForm";
import DogPage from "./features/dogs/dog-details/DogPage";

import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/edit-user/EditUser";
import NewUserForm from "./features/users/create-user/NewUserForm";
import UserPage from "./features/users/user-details/UserPage";

import LittersList from "./features/litters/LittersList";
import NewLitterForm from "./features/litters/create-litter/NewLitterForm";
import LitterPage from "./features/litters/litter-details/LitterPage";

import AdvertisementsList from "./features/advertisements/AdvertisementsList";
import EditAdvertisement from "./features/advertisements/edit-advertisement/EditAdvertisement";
import NewAdvertisementForm from "./features/advertisements/create-advertisement/NewAdvertisementForm";
import AdvertisementPage from "./features/advertisements/advertisement-details/AdvertisementPage";

import ConversationsList from "./features/conversations/ConversationsList";
import ConversationPage from "./features/conversations/ConversationPage";

import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";

import DogReportPage from "./features/dogreports/DogReportPage";
import AdvertisementReportPage from "./features/advertisementreports/AdvertisementReportPage";
import UserReportPage from "./features/userreports/UserReportPage";
import MessageReportPage from "./features/messagereports/MessageReportPage";

import AdminPage from "./features/adminpage/AdminPage";

import AdvertisementReportsList from "./features/adminpage/advertisement-reports/AdvertisementReportsList";
import ReportedAdvertisementPage from "./features/adminpage/advertisement-reports/ReportedAdvertisementPage";

import DogReportsList from "./features/adminpage/dog-reports/DogReportsList";
import ReportedDogPage from "./features/adminpage/dog-reports/ReportedDogPage";

import MessageReportsList from "./features/adminpage/message-reports/MessageReportsList";
import ReportedMessagePage from "./features/adminpage/message-reports/ReportedMessagePage";

import UserReportsList from "./features/adminpage/user-reports/UserReportsList";
import ReportedUserPage from "./features/adminpage/user-reports/ReportedUserPage";

/* import EmailVerify from "./features/auth/emailVerify";
import NewEmail from "./features/auth/newEmail";
import ResetPassword from "./features/auth/ResetPassword";
import ChoosePassword from "./features/auth/ChoosePassword"; */

import FAQ from "./features/policy/Faq";

function App() {
  function hasTouch() {
    return (
      "ontouchstart" in document.documentElement ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  if (hasTouch()) {
    try {
      for (var si in document.styleSheets) {
        var styleSheet = document.styleSheets[si];
        if (!styleSheet.rules) continue;

        for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
          if (!styleSheet.rules[ri].selectorText) continue;

          if (styleSheet.rules[ri].selectorText.match(":hover")) {
            styleSheet.deleteRule(ri);
          }
        }
      }
    } catch (ex) {}
  }

  useTitle("Paw Retriever");

  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<AdvertisementsList />} />
          <Route
            path="advertisements/:advertisementid"
            element={<AdvertisementPage />}
          />
          <Route element={<RequireAuth />}>
            <Route
              path="advertisements/edit/:id"
              element={<EditAdvertisement />}
            />
            <Route
              path="advertisements/new"
              element={<NewAdvertisementForm />}
            />
          </Route>
          <Route path="faq" element={<FAQ />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<NewUserForm />} />
          {/* <Route path="resetpassword">
            <Route index element={<ResetPassword />} />
            <Route
              path=":id/verify/:resettoken"
              element={<ChoosePassword />}
            />
          </Route>
          <Route path="users/:id/verify/:token" element={<EmailVerify />} />
          <Route
            path="users/:id/verifyemail/:emailtoken"
            element={<NewEmail />}
          /> */}
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
              <Route path="new" element={<NewDogForm />} />
            </Route>
          </Route>
          <Route path="litters">
            <Route index element={<LittersList />} />
            <Route path=":litterid" element={<LitterPage />} />
            <Route element={<RequireAuth />}>
              <Route path="new" element={<NewLitterForm />} />
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
            <Route
              path="reportadvertisement/:advertisementid"
              element={<AdvertisementReportPage />}
            />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="reportuser/:userid" element={<UserReportPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route
              path="reportmessage/:messageid"
              element={<MessageReportPage />}
            />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="adminpage" element={<AdminPage />} />
          </Route>
          <Route path="advertisementreports">
            <Route index element={<AdvertisementReportsList />} />
            <Route
              path=":advertisementreportid"
              element={<ReportedAdvertisementPage />}
            />
          </Route>
          <Route path="dogreports">
            <Route index element={<DogReportsList />} />
            <Route path=":dogreportid" element={<ReportedDogPage />} />
          </Route>
          <Route path="messagereports">
            <Route index element={<MessageReportsList />} />
            <Route
              path=":messagereportid"
              element={<ReportedMessagePage />}
            />
          </Route>
          <Route path="userreports">
            <Route index element={<UserReportsList />} />
            <Route path=":userreportid" element={<ReportedUserPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

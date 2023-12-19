import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/auth-slices/authApiSlice";
import HomeIcon from "../config/images/HomeIcon.png";
import NavRight from "./NavRight";
import DropdownLinks from "./DropdownLinks";
import WidescreenLinks from "./WidescreenLinks";
import { alerts } from "./alerts";

const Header = ({ dropdownVisible, setDropdownVisible, windowWidth }) => {
  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onMobileLinkClicked = () => setDropdownVisible(false);
  const onLogoutClicked = () => {
    sendLogout();
    if (windowWidth <= 600) onMobileLinkClicked();
  };

  if (isLoading) return;
  if (isError) alerts.errorAlert(`${error.data?.message}`, "Error Logging Out");

  return (
    <header
      style={
        dropdownVisible === true ? { position: "fixed", width: "100%" } : null
      }
      id="layout-header"
    >
      <nav id="header-nav">
        <Link
          className="header-link header-hover"
          to={"/"}
          onClick={() => (windowWidth > 600 ? null : onMobileLinkClicked())}
        >
          <img width="50" height="50" src={HomeIcon} alt="Home" />
        </Link>
        {windowWidth > 600 ? (
          <>
            <WidescreenLinks />
            <NavRight onLogoutClicked={onLogoutClicked} />
          </>
        ) : (
          <DropdownLinks
            onLogoutClicked={onLogoutClicked}
            onMobileLinkClicked={onMobileLinkClicked}
            dropdownVisible={dropdownVisible}
            onBarsClicked={() => setDropdownVisible(!dropdownVisible)}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;

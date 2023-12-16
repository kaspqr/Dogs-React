import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/auth-slices/authApiSlice";
import HomeIcon from "../config/images/HomeIcon.png";
import NavRight from "./NavRight";
import DropdownLinks from "./DropdownLinks";
import WidescreenLinks from "./WidescreenLinks";

const Header = ({ dropdownVisible, setDropdownVisible, windowWidth }) => {
  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onMobileLinkClicked = () => setDropdownVisible(false);
  const onHomeIconClicked = () =>
    windowWidth > 600 ? null : onMobileLinkClicked();
  const onLogoutClicked = () => {
    sendLogout();
    if (windowWidth <= 600) onMobileLinkClicked();
  };

  const headerStyle =
    dropdownVisible === true ? { position: "fixed", width: "100%" } : null;

  if (isLoading) return;
  if (isError) return <p>Error: {error.data?.message}</p>;

  return (
    <header style={headerStyle} id="layout-header">
      <nav id="header-nav">
        <Link
          className="header-link header-hover"
          to={"/"}
          onClick={onHomeIconClicked}
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

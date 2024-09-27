import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import useAuth from "../hooks/useAuth";

const Layout = () => {
  const { userId, active } = useAuth();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 600 && dropdownVisible === true)
      setDropdownVisible(false);
  }, [windowWidth, dropdownVisible]);

  const handleResize = () => setWindowWidth(window.innerWidth);

  return (
    <>
      <Header
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        windowWidth={windowWidth}
      />
      <div
        id="content"
        className="content"
        style={{
          display: windowWidth <= 600 && dropdownVisible ? "none" : "grid",
        }}
      >
        <div></div>
        <div>
          {!userId?.length || active === true ? (
            <Outlet />
          ) : (
            <p>Your account has been banned.</p>
          )}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Layout;

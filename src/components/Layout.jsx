import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import useAuth from "../hooks/useAuth";
import { useGetUsersQuery } from "../features/users/user-slices/usersApiSlice";

const Layout = () => {
  const { userId } = useAuth();

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

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

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
          {!userId?.length || user?.active === true ? (
            <Outlet />
          ) : (
            <p>You account has been banned.</p>
          )}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Layout;

import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { useRefreshMutation } from "./auth-slices/authApiSlice";
import { selectCurrentToken } from "./auth-slices/authSlice";
import usePersist from "../../hooks/usePersist";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] = useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");

        try {
          await refresh();
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  if (!persist) {
    console.log("no persist");
    return <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    return <p>Loading...</p>;
  } else if (isError) {
    console.log("You are not logged in");
    console.log(error?.data?.message);
    return <Outlet />;
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    return <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    return <Outlet />;
  }

  console.log("You are logged out.");

  return <Outlet />;
};

export default PersistLogin;

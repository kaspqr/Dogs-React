import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { store } from "../../app/store";
import { dogsApiSlice } from "../dogs/dog-slices/dogsApiSlice";
import { usersApiSlice } from "../users/user-slices/usersApiSlice";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      dogsApiSlice.util.prefetch("getDogs", "dogsList", { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;

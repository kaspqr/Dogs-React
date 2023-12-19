import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetUsersQuery } from "./user-slices/usersApiSlice";
import UserIcon from "../../config/images/UserIcon.jpg";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  if (!user) return;

  return (
    <div className="user-div">
      <div className="user-div-image">
        <img
          width="75px"
          height="75px"
          className="user-profile-picture"
          src={user?.image?.length ? user?.image : UserIcon}
          alt="User"
        />
      </div>
      <div className="user-div-info">
        <span>
          <Link className="orange-link" to={`/users/${userId}`}>
            <b>{user?.username}</b>
          </Link>
        </span>
        <br />
        <br />
        <span>
          <b>{user?.name}</b>
        </span>
        <br />
        <span>
          {user?.region?.length && user?.region !== "none "
            ? `${user?.region}, `
            : null}
          {user?.country}
        </span>
      </div>
    </div>
  );
};

const memoizedUser = memo(User);

export default memoizedUser;

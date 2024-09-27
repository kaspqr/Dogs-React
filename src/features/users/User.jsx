import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetUserByIdQuery } from "./user-slices/usersApiSlice";
import UserIcon from "../../config/images/UserIcon.jpg";
import { alerts } from "../../components/alerts";

const User = ({ userId }) => {
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (!user || isLoading) return;

  if (isSuccess) {
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
              : null
            }
            {user?.country}
          </span>
        </div>
      </div>
    );
  }

  return
};

const memoizedUser = memo(User);

export default memoizedUser;

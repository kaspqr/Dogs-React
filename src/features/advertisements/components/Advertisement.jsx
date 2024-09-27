import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice";
import AdIcon from "../../../config/images/AdIcon.jpg";
import { PRICELESS_TYPES } from "../../../config/consts";
import { hasRegion } from "../../../config/utils";
import { alerts } from "../../../components/alerts";

const Advertisement = ({ advertisement }) => {
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: advertisement?.poster }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}aaa`)
  }, [isError])

  if (!advertisement || isLoading) return;

  if (isSuccess) {
    return (
      <div className="advertisement-div">
        <div className="advertisement-div-image">
          <img
            className="advertisement-picture"
            src={advertisement?.image?.length ? advertisement?.image : AdIcon}
            alt="Advertisement"
          />
        </div>
        <div className="advertisement-div-info">
          <p>
            <Link
              className="orange-link"
              to={`/advertisements/${advertisement?.id}`}
            >
              <b>{advertisement?.title}</b>
            </Link>
          </p>
          <br />
          <p>
            <b>{advertisement?.type}</b>
          </p>
          <p>
            {PRICELESS_TYPES.includes(advertisement?.type) && advertisement?.breed}
          </p>
          <p>
            {!PRICELESS_TYPES.includes(advertisement?.type) && (
              <>
                {advertisement?.currency}
                {advertisement?.price}
              </>
            )}
          </p>
          <p>
            {hasRegion(advertisement) ? `${advertisement?.region}, ` : null}
            {advertisement?.country}
          </p>
          <br />
          <p className="advertisement-div-admin">
            Posted by{" "}
            <Link className="orange-link" to={`/users/${user?.id}`}>
              <b>{user?.username}</b>
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return
};

const memoizedAdvertisement = memo(Advertisement);

export default memoizedAdvertisement;

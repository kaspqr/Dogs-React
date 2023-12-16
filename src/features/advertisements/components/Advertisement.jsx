import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetAdvertisementsQuery } from "../advertisement-slices/advertisementsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import AdIcon from "../../../config/images/AdIcon.jpg";
import { PRICELESS_TYPES } from "../../../config/consts";
import { hasRegion } from "../../../config/utils";

const Advertisement = ({ advertisementId }) => {
  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[advertisementId],
    }),
  });

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[advertisement?.poster],
    }),
  });

  const advertisementImageSource = advertisement?.image?.length
    ? advertisement?.image
    : AdIcon;

  if (!advertisement) return;

  return (
    <div className="advertisement-div">
      <div className="advertisement-div-image">
        <img
          className="advertisement-picture"
          src={advertisementImageSource}
          alt="Advertisement"
        />
      </div>
      <div className="advertisement-div-info">
        <p>
          <Link
            className="orange-link"
            to={`/advertisements/${advertisementId}`}
          >
            <b>{advertisement?.title}</b>
          </Link>
        </p>
        <br />
        <p>
          <b>{advertisement?.type}</b>
        </p>
        <p>
          {PRICELESS_TYPES.includes(advertisement?.type) &&
            advertisement?.breed}
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
};

const memoizedAdvertisement = memo(Advertisement);

export default memoizedAdvertisement;

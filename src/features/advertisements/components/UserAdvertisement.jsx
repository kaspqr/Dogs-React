import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetAdvertisementsQuery } from "../advertisement-slices/advertisementsApiSlice";
import AdIcon from "../../../config/images/AdIcon.jpg";
import { PRICELESS_TYPES, BREEDING_TYPES } from "../../../config/consts";
import { hasRegion } from "../../../config/utils";

const UserAdvertisement = ({ advertisementId }) => {
  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[advertisementId],
    }),
  });

  const imageSource = advertisement?.image?.length
    ? advertisement?.image
    : AdIcon;
  const breed = BREEDING_TYPES.includes(advertisement?.type)
    ? advertisement?.breed
    : null;
  const price = !PRICELESS_TYPES.includes(advertisement?.type) ? (
    <>
      {advertisement?.currency}
      {advertisement?.price}
    </>
  ) : null;
  const region = hasRegion(advertisement) ? `${advertisement?.region}, ` : null;

  if (!advertisement) return;

  return (
    <div className="advertisement-div">
      <div className="advertisement-div-image">
        <img
          className="advertisement-picture"
          src={imageSource}
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
        <p>{breed}</p>
        <p>{price}</p>
        <p>
          {region}
          {advertisement?.country}
        </p>
      </div>
    </div>
  );
};

const memoizedUserAdvertisement = memo(UserAdvertisement);

export default memoizedUserAdvertisement;

import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetAdvertisementByIdQuery } from "../advertisement-slices/advertisementsApiSlice";
import AdIcon from "../../../config/images/AdIcon.jpg";
import { PRICELESS_TYPES, BREEDING_TYPES } from "../../../config/consts";
import { hasRegion } from "../../../config/utils";
import { alerts } from "../../../components/alerts";

const UserAdvertisement = ({ advertisementId }) => {
  const {
    data: advertisement,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementByIdQuery({ id: advertisementId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    if (!advertisement) return;

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
              to={`/advertisements/${advertisementId}`}
            >
              <b>{advertisement?.title}</b>
            </Link>
          </p>
          <br />
          <p>
            <b>{advertisement?.type}</b>
          </p>
          <p>{BREEDING_TYPES.includes(advertisement?.type) ? advertisement?.breed : null}</p>
          <p>{!PRICELESS_TYPES.includes(advertisement?.type) ? (
            <>
              {advertisement?.currency}
              {advertisement?.price}
            </>
          ) : null}</p>
          <p>
            {hasRegion(advertisement) ? `${advertisement?.region}, ` : null}
            {advertisement?.country}
          </p>
        </div>
      </div>
    );
  }

  return
};

const memoizedUserAdvertisement = memo(UserAdvertisement);

export default memoizedUserAdvertisement;

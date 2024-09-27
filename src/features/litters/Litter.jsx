import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetLitterByIdQuery } from "./litter-slices/littersApiSlice";
import { hasRegion } from "../../config/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { alerts } from "../../components/alerts";
import LitterParent from "../dogs/dog-details/LitterParent";

const Litter = ({ litterId }) => {
  const {
    data: litter,
    isLoading: isLoading,
    isSuccess: isSuccess,
    isError: isError,
    error: error
  } = useGetLitterByIdQuery({ id: litterId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !litter) return;

  if (isSuccess) {
    return (
      <div className="litter-div">
        <div className="litter-div-info">
          <LitterParent parentId={litter?.mother} litterParent={"Mother"} />
          {litter?.father && <LitterParent parentId={litter?.father} litterParent={"Father"} />}
          <p>Born {litter?.born?.split(" ").slice(1, 4).join(" ")}</p>
          <p>
            {hasRegion(litter) ? `${litter?.region}, ` : null}
            {litter?.country}
          </p>
          <p>{litter?.breed}</p>
          <p>
            {litter?.children} {litter?.children === 1 ? "Puppy" : "Puppies"}
          </p>
        </div>
        <div className="litter-div-link">
          <span className="litter-link-span">
            <p>
              <Link className="eye-view" to={`/litters/${litterId}`}>
                <FontAwesomeIcon icon={faEye} size="xl" />
                <br />
                <b>View Litter</b>
              </Link>
            </p>
          </span>
        </div>
      </div>
    );
  }

  return
};

const memoizedLitter = memo(Litter);

export default memoizedLitter;

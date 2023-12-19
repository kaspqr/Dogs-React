import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetLittersQuery } from "./litter-slices/littersApiSlice";
import { useGetDogsQuery } from "../dogs/dog-slices/dogsApiSlice";
import { hasRegion } from "../../config/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Litter = ({ litterId }) => {
  const { litter } = useGetLittersQuery("littersList", {
    selectFromResult: ({ data }) => ({
      litter: data?.entities[litterId],
    }),
  });

  const { mother } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      mother: data?.entities[litter?.mother],
    }),
  });

  const { father } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      father: data?.entities[litter?.father],
    }),
  });

  if (!litter || !mother) return;

  return (
    <div className="litter-div">
      <div className="litter-div-info">
        <p>
          Mother{" "}
          <Link className="orange-link" to={`/dogs/${mother?.id}`}>
            <b>{mother?.name}</b>
          </Link>
        </p>
        {father ? (
          <p>
            Father{" "}
            <Link className="orange-link" to={`/dogs/${father?.id}`}>
              <b>{father?.name}</b>
            </Link>
          </p>
        ) : (
          <p>Father Not Added</p>
        )}
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
};

const memoizedLitter = memo(Litter);

export default memoizedLitter;

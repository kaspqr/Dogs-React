import { Fragment } from "react";
import { Link } from "react-router-dom";

const DogLitter = ({ litter, parentDogs, allChildren, dog }) => {
  const otherParentId = dog?.female === true ? litter?.father : litter?.mother;
  const hasTwoParents =
    (dog?.female === true && litter?.father?.length) ||
    (dog?.female === false && litter?.mother?.length);

  return (
    <div key={litter?.id}>
      <p>
        <Link
          key={litter?.id}
          className="orange-link"
          to={`/litters/${litter?.id}`}
        >
          <b>Litter</b>
        </Link>
        {hasTwoParents && " with "}
        <Link
          key={otherParentId}
          className="orange-link"
          to={`/dogs/${otherParentId}`}
        >
          <b>
            {parentDogs?.find((parent) => parent?.id === otherParentId)?.name}
          </b>
        </Link>
        {litter?.born?.length && (
          <>
            {" "}
            born on <b>{litter?.born?.split(" ").slice(1, 4).join(" ")}</b>
          </>
        )}
        {!allChildren?.length && (
          <>
            <br />
            This litter doesn't have any puppies added to it
          </>
        )}
        {allChildren?.map((child) =>
          child?.litter === litter?.id ? (
            <Fragment key={child.id}>
              <br />
              {child?.female === true ? <b>Daughter </b> : <b>Son </b>}
              <Link
                key={child?.id}
                className="orange-link"
                to={`/dogs/${child?.id}`}
              >
                <b>{child?.name}</b>
              </Link>
            </Fragment>
          ) : null
        )}
      </p>
      <br />
    </div>
  );
};

export default DogLitter;

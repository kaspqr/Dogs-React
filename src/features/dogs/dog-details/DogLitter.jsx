import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { alerts } from "../../../components/alerts";
import LitterParentName from "../../litters/litter-details/LitterParentName";
import { useGetLitterByIdQuery } from "../../litters/litter-slices/littersApiSlice";
import { useGetLitterPuppiesQuery } from "../dog-slices/dogsApiSlice";

const DogLitter = ({ dog, litterId }) => {
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

  const {
    data: dogs,
    isLoading: isPuppiesLoading,
    isSuccess: isPuppiesSuccess,
    isError: isPuppiesError,
    error: puppiesError
  } = useGetLitterPuppiesQuery({ id: litterId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  useEffect(() => {
    if (isPuppiesError) alerts.errorAlert(`${puppiesError?.data?.message}`)
  }, [isPuppiesError])

  if (isLoading || isPuppiesLoading) return

  if (isSuccess && isPuppiesSuccess) {
    const { ids, entities } = dogs

    const otherParentId = dog?.female === true ? litter?.father : litter?.mother;

    return (
      <div key={dog?.litter}>
        <p>
          <Link
            key={dog?.litter}
            className="orange-link"
            to={`/litters/${dog?.litter}`}
          >
            <b>Litter</b>
          </Link>
          {!otherParentId?.length ? null : " with "}
          {!otherParentId?.length ? null :
            <Link
              key={otherParentId}
              className="orange-link"
              to={`/dogs/${otherParentId}`}
            >
              <b>
                <LitterParentName parentId={otherParentId} />
              </b>
            </Link>          
          }
          {" "}
          born on <b>{litter?.born?.split(" ").slice(1, 4).join(" ")}</b>
          {litter?.puppies < 1 && (
            <>
              <br />
              This litter doesn't have any puppies added to it
            </>
          )}
          {ids?.map((childId) =>
              <Fragment key={childId}>
                <br />
                {entities[childId]?.female === true ? <b>Daughter </b> : <b>Son </b>}
                <Link
                  key={childId}
                  className="orange-link"
                  to={`/dogs/${childId}`}
                >
                  <b>{entities[childId]?.name}</b>
                </Link>
              </Fragment>
          )}
        </p>
        <br />
      </div>
    );
  }

  return
};

export default DogLitter;

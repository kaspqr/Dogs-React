import { useEffect } from "react";
import { Link } from "react-router-dom";
import { alerts } from "../../../components/alerts";
import { useGetLitterPuppiesQuery } from "../dog-slices/dogsApiSlice";

const DogSiblings = ({ dog }) => {
  const {
    data: siblings,
    isLoading: isSiblingsLoading,
    isSuccess: isSiblingsSuccess,
    isError: isSiblingsError,
    error: siblingsError
  } = useGetLitterPuppiesQuery({ id: dog?.litter }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSiblingsError) alerts.errorAlert(`${siblingsError?.data?.message}`)
  }, [isSiblingsError])

  if (isSiblingsLoading) return

  if (isSiblingsSuccess) {
    const { ids, entities } = siblings

    if (ids?.length < 2) return

    return (
      <>
        {ids.filter((id) => id !== dog?.id).map((siblingId) => (
          <p key={siblingId}>
            <b>{entities[siblingId]?.female === true ? <>Sister </> : <>Brother </>}</b>
            <Link className="orange-link" to={`/dogs/${entities[siblingId]?.id}`}>
              <b>{entities[siblingId]?.name}</b>
            </Link>
          </p>
        ))}
        <br />
      </>
    );
  }

  return
};

export default DogSiblings;

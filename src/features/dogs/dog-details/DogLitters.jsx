import { useEffect } from "react";

import DogLitter from "./DogLitter";

import { useGetDogLittersQuery } from "../../litters/litter-slices/littersApiSlice";
import { alerts } from "../../../components/alerts";

const DogLitters = ({ dog }) => {
  const {
    data: litters,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDogLittersQuery({ id: dog?.id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  if (isLoading) return;

  if (isSuccess) {
    const { ids } = litters

    return (
      <>
        {ids?.length ? (
          <>
            <p>
              <b>{dog?.name}'s litters and each litter's puppies</b>
            </p>
            <br />
            {ids?.map((litterId) => (
              <DogLitter key={litterId} dog={dog} litterId={litterId} />
            ))}
          </>
        ) : (
          <>
            {dog?.name} doesn't have any litters added
            <br />
            <br />
          </>
        )}
      </>
    );
  }

  return
};

export default DogLitters;

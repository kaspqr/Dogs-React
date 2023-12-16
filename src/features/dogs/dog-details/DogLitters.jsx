import React from "react";
import Swal from "sweetalert2";

import DogLitter from "./DogLitter";
import { useGetLittersQuery } from "../../litters/litter-slices/littersApiSlice";
import { alerts } from "../../../components/alerts";

const DogLitters = ({ dog, dogIds, dogEntities }) => {
  const {
    data: litters,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLittersQuery("littersList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Litters");
  if (isLoading) return;
  if (isSuccess) Swal.close();

  const { ids: childrenLitterIds, entities: litterEntities } = litters;

  const filteredLitterIds =
    dog?.female === true
      ? childrenLitterIds.filter(
          (litterId) => litterEntities[litterId].mother === dog?.id
        )
      : childrenLitterIds.filter(
          (litterId) => litterEntities[litterId].father === dog?.id
        );

  const filteredLitters = filteredLitterIds.map(
    (litterId) => litterEntities[litterId]
  );

  const filteredDogIds = dogIds?.filter((dogId) =>
    childrenLitterIds?.includes(dogEntities[dogId].litter)
  );
  const allChildren = filteredDogIds?.map((dogId) => dogEntities[dogId]);
  const filteredParents = filteredLitters?.map((litter) => {
    return dog?.female === true ? litter?.father : litter?.mother;
  });

  const parentDogs = filteredParents?.map((dogId) => dogEntities[dogId]);

  const littersContent = filteredLitters?.map((litter) => (
    <DogLitter
      litter={litter}
      parentDogs={parentDogs}
      allChildren={allChildren}
      dog={dog}
    />
  ));

  return (
    <>
      {filteredLitters?.length ? (
        <>
          <p>
            <b>{dog?.name}'s litters and each litter's puppies</b>
          </p>
          <br />
          {littersContent}
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
};

export default DogLitters;

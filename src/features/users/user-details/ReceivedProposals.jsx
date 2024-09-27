import { useEffect, useState } from "react";

import { useUpdateDogMutation } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";
import { useGetProposedDogsQuery } from "../../dogs/dog-slices/proposeDogApiSlice";

const ReceivedProposals = ({ user, userId, dogs }) => {
  const [selectedAcceptDog, setSelectedAcceptDog] = useState("");

  const {
    data: proposedDogs,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProposedDogsQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  const [updateDog, {
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    error: updateError
  }] = useUpdateDogMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isUpdateError) alerts.errorAlert(`${updateError?.data?.message}`);
  }, [isUpdateError])

  if (isLoading || isUpdateLoading) return

  if (isSuccess) {
    const { ids } = proposedDogs
    const { ids: dogIds, entities: dogEntities } = dogs

    if (!ids?.length || !dogIds?.length) return

    const dogIdsProposedByUser = dogIds?.filter((id) => ids.includes(id))

    return (
      <>
        <label htmlFor="accept-selected-dog">
          <b>
            Accept Dog{ids?.length > 1 ? "s" : null} Offered by{" "}
            {user?.username}
          </b>
        </label>
        <br />
        <select
          name="accept-selected-dog"
          value={selectedAcceptDog}
          onChange={(e) => setSelectedAcceptDog(e.target.value)}
        >
          <option value="">--</option>
          {dogIdsProposedByUser?.map((id) => (
            <option value={id} key={id}>
              {dogEntities[id]?.name}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button
          title="Accept Ownership of Selected Dog's Account"
          className="black-button three-hundred"
          disabled={!selectedAcceptDog?.length}
          style={!selectedAcceptDog?.length ? { backgroundColor: "grey", cursor: "default" } : null}
          onClick={async () => {
            await updateDog({ id: selectedAcceptDog, user: userId });
            setSelectedAcceptDog("");
          }}
        >
          Accept Dog
        </button>
        <br />
        <br />
      </>
    );
  }

  return
};

export default ReceivedProposals;

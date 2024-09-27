import { useEffect, useState } from "react";

import { useAddNewDogProposeMutation } from "../../dogs/dog-slices/proposeDogApiSlice";
import { alerts } from "../../../components/alerts";
import { useGetProposableDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";

const ProposeTransfer = ({ user, userId }) => {
  const [selectedProposeDog, setSelectedProposeDog] = useState("");

  const {
    data: proposableDogs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProposableDogsQuery({ userId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewDogPropose, {
    isLoading: isAddNewDogProposeLoading,
    isError: isAddNewDogProposeError,
    error: addNewDogProposeError
  }] = useAddNewDogProposeMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isAddNewDogProposeError) alerts.errorAlert(`${addNewDogProposeError?.data?.message}`);
  }, [isAddNewDogProposeError])

  if (isLoading || isAddNewDogProposeLoading) return

  if (isSuccess) {
    const { ids, entities } = proposableDogs;

    if (!ids?.length) return;

    return (
      <>
        <label htmlFor="transfer-selected-dog">
          <b>Transfer Dog to {user?.username}</b>
        </label>
        <br />
        <select
          name="transfer-selected-dog"
          value={selectedProposeDog}
          onChange={(e) => setSelectedProposeDog(e.target.value)}
        >
          <option value="">--</option>
          {ids?.map((id) => (
            <option value={id} key={id}>
              {entities[id]?.name}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button
          title="Propose Transferring Selected Dog to User"
          className="black-button three-hundred"
          disabled={!selectedProposeDog?.length}
          style={!selectedProposeDog?.length ? { backgroundColor: "grey", cursor: "default" } : null}
          onClick={async () => {
            await addNewDogPropose({ dog: selectedProposeDog, user: user?.id });
            setSelectedProposeDog("");
          }}
        >
          Propose Transfer
        </button>
        <br />
        <br />
      </>
    );
  }

  return
};

export default ProposeTransfer;

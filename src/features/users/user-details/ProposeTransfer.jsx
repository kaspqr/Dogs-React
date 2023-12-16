import { useState } from "react";

import {
  useAddNewDogProposeMutation,
  useGetDogProposesQuery,
} from "../../dogs/dog-slices/proposeDogApiSlice";
import { alerts } from "../../../components/alerts";

const ProposeTransfer = ({ user, userId, ids, entities }) => {
  const [selectedProposeDog, setSelectedProposeDog] = useState("");

  const { data: dogproposes } = useGetDogProposesQuery("dogProposesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewDogPropose, { isError, error }] = useAddNewDogProposeMutation();

  const { ids: proposeIds, entities: proposeEntities } = dogproposes;

  const handleProposeDog = async () => {
    await addNewDogPropose({ dog: selectedProposeDog, user: user?.id });
    setSelectedProposeDog("");
  };

  const userReceivedProposalIds = proposeIds?.filter(
    (proposeId) => proposeEntities[proposeId]?.user === user?.id
  );

  const dogsProposedToUser = userReceivedProposalIds?.map(
    (proposeId) => proposeEntities[proposeId]?.dog
  );

  const proposableDogIds =
    userId?.length && user?.id !== userId
      ? ids?.filter((dogId) => entities[dogId]?.user === userId)
      : null;

  const filteredProposableDogIds = proposableDogIds?.filter(
    (dogId) => !dogsProposedToUser?.includes(dogId)
  );

  const filteredProposableDogs = filteredProposableDogIds?.map(
    (id) => entities[id]
  );

  const proposableDogOptions = filteredProposableDogs?.map((dog) => (
    <option value={dog?.id} key={dog?.id}>
      {dog?.name}
    </option>
  ));

  if (!filteredProposableDogs?.length) return;

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Proposing Dog");

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
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
          {proposableDogOptions}
        </select>
        <br />
        <br />
        <button
          title="Propose Transferring Selected Dog to User"
          className="black-button three-hundred"
          disabled={!selectedProposeDog?.length}
          style={
            !selectedProposeDog?.length
              ? { backgroundColor: "grey", cursor: "default" }
              : null
          }
          onClick={handleProposeDog}
        >
          Propose Transfer
        </button>
        <br />
        <br />
      </form>
    </>
  );
};

export default ProposeTransfer;

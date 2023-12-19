import { useState } from "react";

import { useUpdateDogMutation } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";

const ReceivedProposals = ({
  user,
  userId,
  proposeIds,
  entities,
  proposeEntities,
  filteredIds,
}) => {
  const [selectedAcceptDog, setSelectedAcceptDog] = useState("");

  const [updateDog, { isError, error }] = useUpdateDogMutation();

  const filteredMyProposeIds =
    userId !== user?.id
      ? proposeIds?.filter(
          (proposeId) => proposeEntities[proposeId]?.user === userId
        )
      : null;

  const receivedProposalIds = filteredMyProposeIds?.filter((proposal) =>
    filteredIds?.includes(proposeEntities[proposal]?.dog)
  );

  if (!receivedProposalIds?.length) return;

  const receivedProposals = receivedProposalIds?.map(
    (proposal) => entities[proposeEntities[proposal]?.dog]
  );

  const acceptDogs = receivedProposals?.map((dog) => (
    <option value={dog?.id} key={dog?.id}>
      {dog?.name}
    </option>
  ));

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Updating Dog");

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="accept-selected-dog">
          <b>
            Accept Dog{receivedProposals?.length > 1 ? "s" : null} Offered by{" "}
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
          {acceptDogs}
        </select>
        <br />
        <br />
        <button
          title="Accept Ownership of Selected Dog's Account"
          className="black-button three-hundred"
          disabled={!selectedAcceptDog?.length}
          style={
            !selectedAcceptDog?.length
              ? { backgroundColor: "grey", cursor: "default" }
              : null
          }
          onClick={async () => {
            await updateDog({ id: selectedAcceptDog, user: userId });
            setSelectedAcceptDog("");
          }}
        >
          Accept Dog
        </button>
        <br />
        <br />
      </form>
    </>
  );
};

export default ReceivedProposals;

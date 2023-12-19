import { useState, useEffect } from "react";

import { useUpdateDogMutation } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";
import Swal from "sweetalert2";
import { useAddNewPuppyProposeMutation } from "../litter-slices/puppyProposesApiSlice";
import { DAY } from "../../../config/consts";

const ProposePuppy = ({
  entities,
  userId,
  mother,
  litterId,
  litter,
  currentLitterDogsIds,
  ids,
  father,
  filteredPuppyProposals,
  filteredFatherProposals,
}) => {
  const [selectedDog, setSelectedDog] = useState(undefined);

  const [
    updateDog,
    { isLoading: isUpdateLoading, isError: isUpdateError, error: updateError },
  ] = useUpdateDogMutation();

  const [
    addNewPuppyPropose,
    {
      isLoading: isAddPuppyProposeLoading,
      isError: isAddPuppyProposeError,
      error: addPuppyProposeError,
    },
  ] = useAddNewPuppyProposeMutation();

  useEffect(() => {
    if (isUpdateLoading || isAddPuppyProposeLoading)
      alerts.loadingAlert("Updating Litter", "Loading...");
    else Swal.close();
  }, [isUpdateLoading, isAddPuppyProposeLoading]);

  const filteredUserDogIds = ids.filter(
    (dogId) =>
      entities[dogId].user === userId &&
      entities[dogId].id !== mother?.id &&
      entities[dogId].id !== father?.id &&
      entities[dogId].breed === litter?.breed &&
      new Date(entities[dogId].birth).getTime() >=
        new Date(litter?.born).getTime() &&
      new Date(entities[dogId].birth).getTime() <=
        new Date(new Date(litter?.born).getTime() + 7 * DAY).getTime() &&
      !filteredPuppyProposals?.includes(entities[dogId].id) &&
      !filteredFatherProposals?.includes(entities[dogId].id) &&
      !currentLitterDogsIds.includes(entities[dogId].id)
  );

  if (
    !filteredUserDogIds?.length ||
    litter?.children <= currentLitterDogsIds?.length
  )
    return;

  if (isUpdateError)
    alerts.errorAlert(`${updateError?.data?.message}`, "Error Updating Dog");
  if (isAddPuppyProposeError)
    alerts.errorAlert(
      `${addPuppyProposeError?.data?.message}`,
      "Error Proposing Puppy"
    );

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="pick-dog">
          <b>{userId === mother?.user ? "Add " : "Propose "}Puppy to Litter</b>
        </label>
        <br />
        <select
          name="pick-dog"
          value={selectedDog}
          onChange={(e) => setSelectedDog(e.target.value)}
        >
          <option value="">Pick Your Dog</option>
          {filteredUserDogIds.map((id) => (
            <option value={id} key={id}>
              {entities[id].name}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button
          title={userId === mother?.user ? "Add Dog" : "Propose Dog"}
          className="black-button three-hundred"
          disabled={selectedDog?.length ? false : true}
          style={
            selectedDog?.length
              ? null
              : { backgroundColor: "grey", cursor: "default" }
          }
          onClick={
            userId === mother?.user
              ? async () => {
                  await updateDog({ id: selectedDog, litter: litterId });
                  setSelectedDog("");
                }
              : async () => {
                  await addNewPuppyPropose({
                    litter: litterId,
                    puppy: selectedDog,
                  });
                  setSelectedDog("");
                }
          }
        >
          {userId === mother?.user ? "Add " : "Propose "}Puppy
        </button>
        <br />
        <br />
      </form>
    </>
  );
};

export default ProposePuppy;

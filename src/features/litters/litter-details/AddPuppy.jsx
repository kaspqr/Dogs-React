import { useState } from "react";
import Swal from "sweetalert2";

import { useUpdateDogMutation } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";

const AddPuppy = ({
  proposedPuppies,
  entities,
  litterId,
  userId,
  mother,
  litter,
  currentLitterDogsIds,
}) => {
  const [selectedPuppy, setSelectedPuppy] = useState("");

  const [
    updateDog,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateDogMutation();

  if (
    litter?.children <= currentLitterDogsIds?.length ||
    !proposedPuppies?.length ||
    mother?.user !== userId
  )
    return;

  if (isUpdateLoading) alerts.loadingAlert("Updating Dog", "Loading...");
  if (isUpdateError)
    alerts.errorAlert(`${updateError?.data?.message}`, "Error Updating Dog");
  if (isUpdateSuccess) Swal.close();

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="add-proposed-puppy">
          <b>Add Proposed Puppy</b>
        </label>
        <br />
        <select
          name="add-proposed-puppy"
          value={selectedPuppy}
          onChange={(e) => setSelectedPuppy(e.target.value)}
        >
          <option value="">--</option>
          {userId === mother?.user &&
            proposedPuppies?.map((proposal) => {
              return (
                <option value={proposal} key={proposal}>
                  {entities[proposal]?.name}
                </option>
              );
            })}
        </select>
        <br />
        <br />
        <button
          title="Add Proposed Puppy"
          className="black-button three-hundred"
          style={
            !selectedPuppy?.length
              ? { backgroundColor: "grey", cursor: "default" }
              : null
          }
          disabled={!selectedPuppy?.length}
          onClick={async () => {
            await updateDog({ id: selectedPuppy, litter: litterId });
            setSelectedPuppy("");
          }}
        >
          Add Puppy
        </button>
        <br />
        <br />
      </form>
    </>
  );
};

export default AddPuppy;

import { useState, useEffect } from "react";

import { useGetDogByIdQuery, useUpdateDogMutation } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";
import { useGetPuppyProposesQuery } from "../litter-slices/puppyProposesApiSlice";
import ProposedDogOption from "./ProposedDogOption";

const AddPuppy = ({ userId, litter, refetch }) => {
  const [selectedPuppy, setSelectedPuppy] = useState("");

  const {
    data: proposedPuppies,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchPuppyProposes
  } = useGetPuppyProposesQuery({ id: litter?.id }, {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: mother,
    isLoading: isMotherLoading,
    isSuccess: isMotherSuccess,
    isError: isMotherError,
    error: motherError
  } = useGetDogByIdQuery({ id: litter?.mother }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateDog, {
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    error: updateError
  }] = useUpdateDogMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isMotherError) alerts.errorAlert(`${motherError?.data?.message}`);
  }, [isMotherError]);

  useEffect(() => {
    if (isUpdateError) alerts.errorAlert(`${updateError?.data?.message}`);
  }, [isUpdateError]);

  if (isLoading || isUpdateLoading || isMotherLoading) return

  if (isSuccess && isMotherSuccess) {
    const { ids, entities } = proposedPuppies

    if (mother?.user !== userId || !ids?.length) return

    return (
      <>
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
          {ids?.map((id) => <ProposedDogOption key={id} dogId={entities[id]?.puppy} />)}
        </select>
        <br />
        <br />
        <button
          title="Add Proposed Puppy"
          className="black-button three-hundred"
          style={!selectedPuppy?.length ? { backgroundColor: "grey", cursor: "default" } : null}
          disabled={!selectedPuppy?.length}
          onClick={async () => {
            await updateDog({ id: selectedPuppy, litter: litter?.id });
            setSelectedPuppy("");
            refetch()
            refetchPuppyProposes()
          }}
        >
          Add Puppy
        </button>
        <br />
        <br />
      </>
    );
  }

  return
};

export default AddPuppy;

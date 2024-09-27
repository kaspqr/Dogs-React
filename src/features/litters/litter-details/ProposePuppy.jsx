import { useState, useEffect } from "react";

import { useGetDogByIdQuery, useGetProposablePuppiesQuery, useUpdateDogMutation } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";
import { useAddNewPuppyProposeMutation } from "../litter-slices/puppyProposesApiSlice";

const ProposePuppy = ({ userId, litter, refetchPuppies }) => {
  const [selectedDog, setSelectedDog] = useState(undefined);

  const {
    data: proposablePuppies,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetProposablePuppiesQuery({ userId, litterId: litter?.id }, {
    pollingInterval: 600000,
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

  const [addNewPuppyPropose, {
    isLoading: isAddPuppyProposeLoading,
    isError: isAddPuppyProposeError,
    error: addPuppyProposeError,
  }] = useAddNewPuppyProposeMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isMotherError) alerts.errorAlert(`${motherError?.data?.message}`);
  }, [isMotherError])

  useEffect(() => {
    if (isUpdateError) alerts.errorAlert(`${updateError?.data?.message}`);
  }, [isUpdateError])

  useEffect(() => {
    if (isAddPuppyProposeError) alerts.errorAlert(`${addPuppyProposeError?.data?.message}`);
  }, [isAddPuppyProposeError])

  if (isLoading || isUpdateLoading || isAddPuppyProposeLoading || isMotherLoading) return

  if (isSuccess && isMotherSuccess) {
    const { ids, entities } = proposablePuppies

    if (!ids?.length) return

    return (
      <>
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
          {ids.map((id) => (
            <option value={id} key={id}>
              {entities[id].name}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button
          title={`${userId === mother?.user ? "Add" : "Propose"} Dog`}
          className="black-button three-hundred"
          disabled={selectedDog?.length ? false : true}
          style={selectedDog?.length ? null : { backgroundColor: "grey", cursor: "default" }}
          onClick={userId === mother?.user
            ? async () => {
              await updateDog({ id: selectedDog, litter: litter?.id });
              setSelectedDog("");
              refetch()
              refetchPuppies()
            }
            : async () => {
              await addNewPuppyPropose({ litter: litter?.id, puppy: selectedDog  });
              setSelectedDog("");
              refetch()
              refetchPuppies()
            }
          }
        >
          {userId === mother?.user ? "Add " : "Propose "}Puppy
        </button>
        <br />
        <br />
      </>
    );
  }

  return
};

export default ProposePuppy;

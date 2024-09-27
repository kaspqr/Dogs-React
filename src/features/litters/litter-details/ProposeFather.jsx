import { useEffect, useState } from "react";

import { alerts } from "../../../components/alerts";
import { useAddNewFatherProposeMutation } from "../litter-slices/fatherProposesApiSlice";
import { useUpdateLitterMutation } from "../litter-slices/littersApiSlice";
import { useGetDogByIdQuery, useGetProposableFatherDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";

const ProposeFather = ({ userId, litter, refetchLitter }) => {
  const [selectedFather, setSelectedFather] = useState("");

  const {
    data: proposableFatherDogs,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetProposableFatherDogsQuery({ userId, litterId: litter?.id }, {
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

  const [addNewFatherPropose, {
    isLoading: isAddFatherProposeLoading,
    isError: isAddFatherProposeError,
    error: addFatherProposeError
  }] = useAddNewFatherProposeMutation();

  const [updateLitter, {
    isLoading: isLitterLoading,
    isError: isLitterError,
    error: litterError
  }] = useUpdateLitterMutation();

  useEffect(() => {
    if (isError) alerts.loadingAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isMotherError) alerts.loadingAlert(`${motherError?.data?.message}`);
  }, [isMotherError]);

  useEffect(() => {
    if (isAddFatherProposeError) alerts.loadingAlert(`${addFatherProposeError?.data?.message}`);
  }, [isAddFatherProposeError]);

  useEffect(() => {
    if (isLitterError) alerts.loadingAlert(`${litterError?.data?.message}`);
  }, [isLitterError]);

  if (isLoading || isAddFatherProposeLoading || isLitterLoading || isMotherLoading) return

  if (isSuccess && isMotherSuccess) {
    const { ids, entities } = proposableFatherDogs

    if (!ids?.length) return

    const canSaveFather = selectedFather?.length;

    return (
      <>
        <label htmlFor="pick-your-dog">
          <b>
            {userId === mother?.user ? "Add " : "Propose "}
            Father to Litter
          </b>
        </label>
        <br />
        <select
          name="pick-your-dog"
          value={selectedFather}
          onChange={(e) => setSelectedFather(e.target.value)}
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
          title={userId === mother?.user ? "Add Father" : "Propose Father"}
          className="black-button three-hundred"
          style={!canSaveFather ? { backgroundColor: "grey", cursor: "default" } : null}
          disabled={!canSaveFather}
          onClick={userId === mother?.user
            ? async () => {
              await updateLitter({ id: litter?.id, father: selectedFather });
              setSelectedFather("");
              refetchLitter()
              refetch()
            }
            : async () => {
              await addNewFatherPropose({ litter: litter?.id, father: selectedFather });
              setSelectedFather("");
              refetchLitter()
              refetch()
            }
          }
        >
          {userId === mother?.user ? "Add " : "Propose "}Father
        </button>
        <br />
        <br />
      </>
    );
  }

  return
};

export default ProposeFather;

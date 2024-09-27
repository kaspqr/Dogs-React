import { useState, useEffect } from "react";

import { useUpdateLitterMutation } from "../litter-slices/littersApiSlice";
import { alerts } from "../../../components/alerts";
import { useGetDogByIdQuery } from "../../dogs/dog-slices/dogsApiSlice";
import { useGetFatherProposesQuery } from "../litter-slices/fatherProposesApiSlice";
import ProposedDogOption from "./ProposedDogOption";

const AddFather = ({ litter, userId, refetch }) => {
  const [selectedFather, setSelectedFather] = useState("");

  const {
    data: fatherProposals,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchFatherProposes
  } = useGetFatherProposesQuery({ id: litter?.id }, {
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

  const [updateLitter, {
    isLoading: isLitterLoading,
    isError: isLitterError,
    error: litterError
  }] = useUpdateLitterMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isMotherError) alerts.errorAlert(`${motherError?.data?.message}`);
  }, [isMotherError]);

  useEffect(() => {
    if (isLitterError) alerts.errorAlert(`${litterError?.data?.message}`);
  }, [isLitterError]);

  if (isLoading || isMotherLoading || isLitterLoading) return

  if (isSuccess && isMotherSuccess) {
    const { ids, entities } = fatherProposals

    if (userId !== mother?.user || !ids?.length) return

    return (
      <>
        <label htmlFor="add-proposed-father">
          <b>Add Proposed Father</b>
        </label>
        <br />
        <select
          name="add-proposed-father"
          value={selectedFather}
          onChange={(e) => setSelectedFather(e.target.value)}
        >
          <option value="">--</option>
          {ids?.map((id) => <ProposedDogOption key={id} dogId={entities[id]?.father} />)}
        </select>
        <br />
        <br />
        <button
          title="Add Proposed Father"
          className="black-button three-hundred"
          style={!selectedFather?.length ? { backgroundColor: "grey", cursor: "default" } : null}
          disabled={!selectedFather?.length}
          onClick={async () => {
            await updateLitter({ id: litter?.id, father: selectedFather });
            setSelectedFather("");
            refetch()
            refetchFatherProposes()
          }}
        >
          Add Father
        </button>
        <br />
        <br />
      </>
    );
  }

  return
};

export default AddFather;

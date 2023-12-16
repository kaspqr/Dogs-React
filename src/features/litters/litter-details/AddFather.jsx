import { useState } from "react";
import Swal from "sweetalert2";

import { useUpdateLitterMutation } from "../litter-slices/littersApiSlice";
import { alerts } from "../../../components/alerts";

const AddFather = ({ fatherProposals, entities, litterId, father }) => {
  const [selectedFather, setSelectedFather] = useState("");

  const [
    updateLitter,
    {
      isLoading: isLitterLoading,
      isSuccess: isLitterSuccess,
      isError: isLitterError,
      error: litterError,
    },
  ] = useUpdateLitterMutation();

  if (father?.id?.length) return;
  if (!fatherProposals?.length) return;

  if (isLitterLoading) alerts.loadingAlert("Updating Litter", "Loading...");
  if (isLitterError)
    alerts.errorAlert(`${litterError?.data?.message}`, "Error Updating Litter");
  if (isLitterSuccess) Swal.close();

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
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
          {fatherProposals?.map((proposal) => {
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
          title="Add Proposed Father"
          className="black-button three-hundred"
          style={
            !selectedFather?.length
              ? { backgroundColor: "grey", cursor: "default" }
              : null
          }
          disabled={!selectedFather?.length}
          onClick={async () => {
            await updateLitter({ id: litterId, father: selectedFather });
            setSelectedFather("");
          }}
        >
          Add Father
        </button>
        <br />
        <br />
      </form>
    </>
  );
};

export default AddFather;

import { useState } from "react";
import Swal from "sweetalert2";
import { alerts } from "../../../components/alerts";
import { useAddNewFatherProposeMutation } from "../litter-slices/fatherProposesApiSlice";
import { useUpdateLitterMutation } from "../litter-slices/littersApiSlice";
import { DAY } from "../../../config/consts";

const ProposeFather = ({
  entities,
  isLoading,
  userId,
  mother,
  litterId,
  father,
  ids,
  litter,
  currentLitterDogsIds,
  filteredPuppyProposals,
  filteredFatherProposals,
}) => {
  const [selectedFather, setSelectedFather] = useState("");

  const [
    addNewFatherPropose,
    {
      isLoading: isAddFatherProposeLoading,
      isSuccess: isAddFatherProposeSuccess,
      isError: isAddFatherProposeError,
      error: addFatherProposeError,
    },
  ] = useAddNewFatherProposeMutation();

  const [
    updateLitter,
    {
      isLoading: isLitterLoading,
      isSuccess: isLitterSuccess,
      isError: isLitterError,
      error: litterError,
    },
  ] = useUpdateLitterMutation();

  const fatherIds = ids?.filter(
    (dogId) =>
      entities[dogId].user === userId &&
      entities[dogId].id !== father?.id &&
      entities[dogId].female === false &&
      new Date(entities[dogId].birth).getTime() <
        new Date(new Date(litter?.born).getTime() - 30 * DAY) &&
      !filteredFatherProposals?.includes(entities[dogId].id) &&
      !filteredPuppyProposals?.includes(entities[dogId].id) &&
      ((entities[dogId].breed !== "Mixed breed" &&
        entities[dogId].breed !== mother?.breed &&
        litter?.breed === "Mixed breed") ||
        (entities[dogId].breed === "Mixed breed" &&
          litter?.breed === "Mixed breed") ||
        (entities[dogId].breed === litter?.breed &&
          litter?.breed === mother?.breed)) &&
      !currentLitterDogsIds.includes(entities[dogId].id)
  );

  if (isAddFatherProposeLoading || isLitterLoading)
    alerts.loadingAlert("Updating Litter", "Loading...");
  if (isLitterError)
    alerts.errorAlert(`${litterError?.data?.message}`, "Error Updating Litter");
  if (isAddFatherProposeError)
    alerts.errorAlert(
      `${addFatherProposeError?.data?.message}`,
      "Error Proposing Father"
    );
  if (isAddFatherProposeSuccess || isLitterSuccess) Swal.close();

  if (father?.id?.length || !fatherIds?.length) return;

  const canSaveFather = selectedFather?.length && !isLoading;
  const fatherButtonStyle = !canSaveFather
    ? { backgroundColor: "grey", cursor: "default" }
    : null;

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
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
          {fatherIds.map((id) => (
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
          style={fatherButtonStyle}
          disabled={!canSaveFather}
          onClick={
            userId === mother?.user
              ? async () => {
                  await updateLitter({ id: litterId, father: selectedFather });
                  setSelectedFather("");
                }
              : async () => {
                  await addNewFatherPropose({
                    litter: litterId,
                    father: selectedFather,
                  });
                  setSelectedFather("");
                }
          }
        >
          {userId === mother?.user ? "Add " : "Propose "}Father
        </button>
        <br />
        <br />
      </form>
    </>
  );
};

export default ProposeFather;

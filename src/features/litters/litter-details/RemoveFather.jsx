import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { useUpdateLitterMutation } from "../litter-slices/littersApiSlice";
import { alerts } from "../../../components/alerts";

const RemoveFather = ({ litterId, father, mother, userId }) => {
  const [removalVisible, setRemovalVisible] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState("");

  const [
    updateLitter,
    { isLoading: isLitterLoading, isError: isLitterError, error: litterError },
  ] = useUpdateLitterMutation();

  useEffect(() => {
    if (isLitterLoading) alerts.loadingAlert("Updating Litter", "Loading...");
    else Swal.close();
  }, [isLitterLoading]);

  if (!father?.id?.length || userId !== mother?.user || userId !== father?.user)
    return;

  if (isLitterError)
    alerts.errorAlert(`${litterError?.data?.message}`, "Error Updating Litter");

  return (
    <>
      <button
        title="Remove Father from Litter"
        className="black-button three-hundred"
        onClick={() => setRemovalVisible(!removalVisible)}
      >
        Remove Father
      </button>
      <br />
      <br />
      {removalVisible && (
        <>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="confirm-remove">
              <b>
                Type "confirmremove" and click on the Confirm Removal button to
                remove your dog from the litter's father position
              </b>
            </label>
            <br />
            <input
              className="three-hundred"
              name="confirm-remove"
              type="text"
              value={confirmRemove}
              onChange={(e) => setConfirmRemove(e.target.value)}
            />
            <br />
            <br />
          </form>
          <button
            className="black-button three-hundred"
            title="Confirm Removal"
            disabled={confirmRemove !== "confirmremove"}
            style={
              confirmRemove !== "confirmremove"
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
            onClick={async () => {
              await updateLitter({ id: litterId, removeFather: true });
              setConfirmRemove("");
              setRemovalVisible(false);
            }}
          >
            Confirm Removal
          </button>
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default RemoveFather;

import { useState, useEffect } from "react";

import { useUpdateLitterMutation } from "../litter-slices/littersApiSlice";
import { alerts } from "../../../components/alerts";
import { useGetDogByIdQuery } from "../../dogs/dog-slices/dogsApiSlice";

const RemoveFather = ({ litterMotherId, litterFatherId, litterId, userId, refetch }) => {
  const [removalVisible, setRemovalVisible] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState("");

  const {
    data: dog,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id: litterFatherId }, {
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
  } = useGetDogByIdQuery({ id: litterMotherId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateLitter, {
    isLoading: isDelLoading,
    isError: isDelError,
    error: delError
  }] = useUpdateLitterMutation();

  useEffect(() => {
    if (isError) alerts.loadingAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isMotherError) alerts.loadingAlert(`${motherError?.data?.message}`);
  }, [isMotherError]);

  useEffect(() => {
    if (isDelError) alerts.loadingAlert(`${delError?.data?.message}`);
  }, [isDelError]);

  if (isLoading || isMotherLoading || isDelLoading) return

  if (isSuccess && isMotherSuccess) {
    if (dog?.user !== userId && mother?.user !== userId) return

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
              style={confirmRemove !== "confirmremove" ? { backgroundColor: "grey", cursor: "default" } : null}
              onClick={async () => {
                await updateLitter({ id: litterId, removeFather: true });
                setConfirmRemove("");
                setRemovalVisible(false);
                refetch();
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
  }

  return
};

export default RemoveFather;

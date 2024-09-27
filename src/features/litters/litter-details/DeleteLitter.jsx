import { useEffect, useState } from "react";
import { alerts } from "../../../components/alerts";
import { useDeleteLitterMutation } from "../litter-slices/littersApiSlice";
import { useNavigate } from "react-router-dom";
import { useGetDogByIdQuery } from "../../dogs/dog-slices/dogsApiSlice";

const DeleteLitter = ({ litter, userId }) => {
  const navigate = useNavigate();

  const [deletionVisible, setDeletionVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

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

  const [deleteLitter, {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError,
  }] = useDeleteLitterMutation();

  useEffect(() => {
    if (isDelSuccess) navigate("/litters");
  }, [isDelSuccess, navigate]);

  useEffect(() => {
    if (isMotherError) alerts.errorAlert(`${motherError?.data?.message}`);
  }, [isMotherError]);

  useEffect(() => {
    if (isDelError) alerts.errorAlert(`${delError?.data?.message}`);
  }, [isDelError]);

  if (isDelLoading || isMotherLoading) return

  if (isMotherSuccess) {
    if (mother?.user !== userId) return

    return (
      <>
        <br />
        <button
          title="Delete Litter"
          className="black-button three-hundred"
          onClick={() => setDeletionVisible(!deletionVisible)}
        >
          Delete Litter
        </button>
        {deletionVisible && (
          <>
            <br />
            <br />
            <label htmlFor="confirm-delete">
              <b>
                Type "confirmdelete" and click on the Confirm Deletion button to
                delete your dog's litter from the database.
              </b>
            </label>
            <br />
            <input
              className="three-hundred"
              name="confirm-delete"
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
            />
            <br />
            <br />
            <button
              className="black-button three-hundred"
              title="Confirm Deletion"
              disabled={confirmDelete !== "confirmdelete"}
              style={confirmDelete !== "confirmdelete" ? { backgroundColor: "grey", cursor: "default" } : null}
              onClick={async () => {
                await deleteLitter({ id: litter?.id });
                setDeletionVisible(false);
                setConfirmDelete("");
              }}
            >
              Confirm Deletion
            </button>
          </>
        )}
      </>
    );
  }

  return
};

export default DeleteLitter;

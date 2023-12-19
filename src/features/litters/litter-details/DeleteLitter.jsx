import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { alerts } from "../../../components/alerts";
import { useDeleteLitterMutation } from "../litter-slices/littersApiSlice";
import { useNavigate } from "react-router-dom";

const DeleteLitter = ({ litterId }) => {
  const navigate = useNavigate();

  const [deletionVisible, setDeletionVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");

  const [
    deleteLitter,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteLitterMutation();

  useEffect(() => {
    if (isDelSuccess) navigate("/litters");
  }, [isDelSuccess, navigate]);

  useEffect(() => {
    if (isDelLoading) alerts.loadingAlert("Deleting Litter", "Loading...");
    else Swal.close();
  }, [isDelLoading]);

  if (isDelError)
    alerts.errorAlert(`${delError?.data?.message}`, "Error Deleting Litter");

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
          <form onSubmit={(e) => e.preventDefault()}>
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
          </form>
          <button
            className="black-button three-hundred"
            title="Confirm Deletion"
            disabled={confirmDelete !== "confirmdelete"}
            style={
              confirmDelete !== "confirmdelete"
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
            onClick={async () => {
              await deleteLitter({ id: litterId });
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
};

export default DeleteLitter;

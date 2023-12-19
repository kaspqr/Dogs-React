import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
} from "../advertisement-slices/advertisementsApiSlice";
import { CURRENCIES } from "../../../config/currencies";
import {
  DISABLED_BUTTON_STYLE,
  PRICE_REGEX,
  TITLE_REGEX,
} from "../../../config/consts";
import { PRICELESS_TYPES } from "../../../config/consts";
import { regexInputEmptyChanged } from "../../../config/utils";
import { alerts } from "../../../components/alerts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const EditAdvertisementForm = ({ advertisement }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(advertisement?.title);
  const [price, setPrice] = useState(advertisement?.price);
  const [validPrice, setValidPrice] = useState(PRICE_REGEX.test(price));
  const [currency, setCurrency] = useState(advertisement?.currency);
  const [info, setInfo] = useState(advertisement?.info);
  const [previewSource, setPreviewSource] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deletionVisible, setDeletionVisible] = useState(false);

  const fileInputRef = useRef(null);

  const [updateAdvertisement, { isLoading, isSuccess, isError, error }] =
    useUpdateAdvertisementMutation();

  const [
    deleteAdvertisement,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteAdvertisementMutation();

  useEffect(() => {
    setValidPrice(PRICE_REGEX.test(price));
  }, [price]);

  useEffect(() => {
    if (isDelSuccess) {
      alerts.successAlert("Advertisement Deleted");
      navigate("/");
    } else if (isSuccess) {
      navigate(`/advertisements/${advertisement?.id}`);
    }
  }, [isSuccess, isDelSuccess, navigate, advertisement?.id]);

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Updating Advertisement", "Loading...");
    if (isDelLoading)
      alerts.loadingAlert("Deleting Advertisement", "Loading...");
    if (!isLoading && !isDelLoading) Swal.close();
  }, [isLoading, isDelLoading]);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileChanged = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const confirmDeleteButtonDisabled = confirmDelete !== "confirmdelete";
  const validPriceOrPricelessType =
    validPrice || PRICELESS_TYPES.includes(advertisement?.type);
  const canSave =
    title?.length && info?.length && validPriceOrPricelessType && !isLoading;

  if (isError)
    alerts.errorAlert(
      `${error?.data?.message}`,
      "Error Updating Advertisement"
    );
  if (isDelError)
    alerts.errorAlert(
      `${delError?.data?.message}`,
      "Error Deleting Advertisement"
    );

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <p className="advertisement-edit-page-title">Edit Advertisement</p>
        </div>
        <label htmlFor="name">
          <b>Title</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="title"
          name="title"
          maxLength="50"
          value={title}
          onChange={(e) => regexInputEmptyChanged(e, TITLE_REGEX, setTitle)}
        />
        <br />
        <span
          className="top-spacer label-file-input"
          onClick={() => fileInputRef.current.click()}
          htmlFor="advertisement-image"
        >
          <b>Browse Picture</b>
          <label className="off-screen" htmlFor="advertisement-image">
            Browse Picture
          </label>{" "}
          <FontAwesomeIcon icon={faUpload} />
          <input
            id="file"
            type="file"
            name="advertisement-image"
            ref={fileInputRef}
            onChange={handleFileChanged}
            style={{ display: "none" }}
          />
        </span>
        <br />
        {previewSource && (
          <>
            <br />
            <img className="three-hundred" src={previewSource} alt="chosen" />
            <br />
          </>
        )}
        {!PRICELESS_TYPES.includes(advertisement?.type) && (
          <>
            <label className="top-spacer" htmlFor="price">
              <b>Price</b>
            </label>
            <br />
            <input
              className="three-hundred"
              type="text"
              id="price"
              name="price"
              maxLength="12"
              value={price}
              onChange={(e) => {
                if (PRICE_REGEX.test(e.target.value) || e.target.value === "") {
                  setPrice(e.target.value);
                }
              }}
            />
            <br />
            <label className="top-spacer" htmlFor="currency">
              <b>Currency</b>
            </label>
            <br />
            <select
              id="currency"
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES}
            </select>
          </>
        )}
        <br />
        <label className="top-spacer" htmlFor="info">
          <b>Info</b>
        </label>
        <br />
        <textarea
          className="three-hundred"
          id="info"
          name="info"
          cols="30"
          rows="10"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
        <br />
        <br />
      </form>
      <div className="advertisement-edit-page-buttons-div">
        <button
          title="Save"
          className="black-button three-hundred"
          onClick={async () => {
            await updateAdvertisement({
              id: advertisement.id,
              title,
              info,
              price,
              currency,
              image: previewSource,
            });
          }}
          disabled={!canSave}
          style={!canSave ? DISABLED_BUTTON_STYLE : null}
        >
          Save
        </button>
        <br />
        <br />
        <button
          title="Delete"
          className="black-button three-hundred"
          onClick={() => setDeletionVisible(!deletionVisible)}
        >
          Delete
        </button>
        {deletionVisible && (
          <>
            <br />
            <br />
            <label htmlFor="confirm-delete">
              <b>
                Type "confirmdelete" and click on the Confirm Deletion button to
                delete your advertisement from the database.
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
              disabled={confirmDeleteButtonDisabled}
              style={confirmDeleteButtonDisabled ? DISABLED_BUTTON_STYLE : null}
              onClick={async () => {
                await deleteAdvertisement({ id: advertisement.id });
                setDeletionVisible(false);
                setConfirmDelete("");
              }}
            >
              Confirm Deletion
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default EditAdvertisementForm;

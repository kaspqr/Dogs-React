import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import Swal from "sweetalert2";

import "../../../styles/customCalendar.css";
import {
  useUpdateDogMutation,
  useDeleteDogMutation,
} from "../dog-slices/dogsApiSlice";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";
import { DISABLED_BUTTON_STYLE } from "../../../config/consts";
import { alerts } from "../../../components/alerts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

const EditDogForm = ({ dog }) => {
  const navigate = useNavigate();

  const NAME_REGEX = /^(?!^\s*$)(?:[a-zA-Z']+(\s|$))+$/;

  const [heat, setHeat] = useState(
    typeof dog?.heat === "boolean" ? dog.heat : false
  );
  const [sterilized, setSterilized] = useState(dog?.sterilized);
  const [death, setDeath] = useState(
    dog?.death?.length && dog?.death !== "none " ? dog.death : ""
  );
  const [name, setName] = useState(dog?.name);
  const [microchipped, setMicrochipped] = useState(
    typeof dog?.microchipped === "boolean" ? dog.microchipped : false
  );
  const [chipnumber, setChipnumber] = useState(
    dog?.chipnumber?.length && dog?.chipnumber !== "none " ? dog.chipnumber : ""
  );
  const [passport, setPassport] = useState(
    typeof dog?.passport === "boolean" ? dog.passport : false
  );
  const [info, setInfo] = useState(dog?.info?.length ? dog.info : "");
  const [country, setCountry] = useState(
    dog?.country?.length ? dog.country : "Argentina"
  );
  const [region, setRegion] = useState(
    dog?.region?.length ? dog.region : "none "
  );
  const [instagram, setInstagram] = useState(
    dog?.instagram?.length && dog?.instagram !== "none " ? dog.instagram : ""
  );
  const [facebook, setFacebook] = useState(
    dog?.facebook?.length && dog?.facebook !== "none " ? dog.facebook : ""
  );
  const [youtube, setYoutube] = useState(
    dog?.youtube?.length && dog?.youtube !== "none " ? dog.youtube : ""
  );
  const [tiktok, setTiktok] = useState(
    dog?.tiktok?.length && dog?.tiktok !== "none " ? dog.tiktok : ""
  );
  const [previewSource, setPreviewSource] = useState();
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deletionVisible, setDeletionVisible] = useState(false);
  const fileInputRef = useRef(null);

  const [updateDog, { isLoading, isSuccess, isError, error }] =
    useUpdateDogMutation();

  const [
    deleteDog,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteDogMutation();

  useEffect(() => {
    if (isSuccess) {
      Swal.close();
      navigate(`/dogs/${dog?.id}`);
    }
  }, [isSuccess, navigate, dog?.id]);

  const handleSaveDogClicked = async () => {
    if (!instagram?.length) setInstagram("none ");
    if (!facebook?.length) setFacebook("none ");
    if (!youtube?.length) setYoutube("none ");
    if (!tiktok?.length) setTiktok("none ");
    if (!region?.length) setRegion("none ");
    if (!info?.length) setInfo("none ");
    if (!chipnumber?.length) setChipnumber("none ");

    const finalDeath = death !== "" ? new Date(death).toDateString() : "none ";

    await updateDog({
      id: dog.id,
      name,
      country,
      region,
      death: finalDeath,
      sterilized,
      passport,
      microchipped,
      chipnumber,
      info,
      heat,
      instagram,
      facebook,
      youtube,
      tiktok,
      image: previewSource,
    });
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  if (isLoading) alerts.loadingAlert("Updating dog");
  if (isDelLoading) alerts.loadingAlert("Deleting dog");
  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Updating Dog");
  if (isDelError)
    alerts.errorAlert(`${delError?.data?.message}`, "Error Deleting Dog");
  if (isDelSuccess) {
    Swal.close();
    navigate("/dogs");
  }

  const canSave = !isLoading && NAME_REGEX.test(name);

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <p className="edit-dog-page-title">Edit Dog</p>
        </div>
        <br />
        <label htmlFor="name">
          <b>Dog's Name (Max. 30 Letters) - Required</b>
        </label>
        <br />
        <input
          className="three-hundred"
          name="name"
          id="name"
          maxLength="30"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <button
          title="Browse Picture"
          onClick={() => fileInputRef.current.click()}
          className="three-hundred black-button top-spacer"
        >
          Browse Picture
        </button>
        <label htmlFor="dog-image" className="off-screen">
          Browse Picture
        </label>
        <input
          id="file"
          type="file"
          name="dog-image"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files[0];
            previewFile(file);
          }}
          style={{ display: "none" }}
        />
        <br />
        {(previewSource || (dog?.image?.length && dog?.image !== "none")) && (
          <>
            <img
              className="dog-profile-picture top-spacer"
              height="300px"
              width="300px"
              src={previewSource ? previewSource : dog?.image}
              alt="chosen"
            />
            <br />
          </>
        )}
        <label className="top-spacer" htmlFor="country">
          <b>Country</b>
        </label>
        <br />
        <select
          name="country"
          id="country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setRegion("");
          }}
        >
          {COUNTRIES}
        </select>
        <br />
        <label className="top-spacer" htmlFor="region">
          <b>Region</b>
        </label>
        <br />
        <select
          disabled={!BIG_COUNTRIES?.includes(country)}
          name="region"
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="none ">--</option>
          {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
        </select>
        <br />
        <label htmlFor="passport" className="top-spacer">
          <b>Passport </b>
          <FontAwesomeIcon
            name="passport"
            onClick={() => setPassport((prev) => !prev)}
            size="xl"
            icon={passport ? faToggleOn : faToggleOff}
            color={passport ? "rgb(23, 152, 207)" : "grey"}
          />
        </label>
        <br />
        {dog?.female === true && (
          <>
            <label className="top-spacer" htmlFor="heat">
              <b>Heat </b>
              <FontAwesomeIcon
                name="heat"
                onClick={() => setHeat((prev) => !prev)}
                size="xl"
                icon={heat ? faToggleOn : faToggleOff}
                color={heat ? "rgb(23, 152, 207)" : "grey"}
              />
            </label>
            <br />
          </>
        )}
        <label className="top-spacer" htmlFor="sterilized">
          <b>{dog?.female === true ? "Sterilized " : "Castrated "}</b>
          <FontAwesomeIcon
            name="sterilized"
            onClick={() => setSterilized((prev) => !prev)}
            size="xl"
            icon={sterilized ? faToggleOn : faToggleOff}
            color={sterilized ? "rgb(23, 152, 207)" : "grey"}
          />
        </label>
        <br />
        <label className="top-spacer" htmlFor="microchipped">
          <b>Microchipped </b>
          <FontAwesomeIcon
            name="microchipped"
            onClick={() => {
              if (microchipped === true) setChipnumber("");
              setMicrochipped((prev) => !prev);
            }}
            size="xl"
            icon={microchipped ? faToggleOn : faToggleOff}
            color={microchipped ? "rgb(23, 152, 207)" : "grey"}
          />
        </label>
        <br />
        <label className="top-spacer" htmlFor="chipnumber">
          <b>Chipnumber</b>
        </label>
        <br />
        <input
          className="three-hundred"
          disabled={microchipped === false}
          type="text"
          id="chipnumber"
          name="chipnumber"
          value={chipnumber}
          onChange={(e) => setChipnumber(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="instagram">
          <b>Instagram Username</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="instagram"
          name="instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="facebook">
          <b>Facebook Username</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="facebook"
          name="facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="youtube">
          <b>YouTube Username</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="youtube"
          name="youtube"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="tiktok">
          <b>TikTok Username</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="tiktok"
          name="tiktok"
          value={tiktok}
          onChange={(e) => setTiktok(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="death">
          <b>Date of Death</b>
        </label>
        <br />
        <Calendar
          name="death"
          minDate={new Date(dog?.birth) || null}
          maxDate={new Date()}
          onChange={(date) => setDeath(date)}
          value={death}
        />
        <button
          title="Clear Date of Death"
          className="black-button"
          style={death === "" ? DISABLED_BUTTON_STYLE : null}
          disabled={death === ""}
          onClick={() => setDeath("")}
        >
          Clear date
        </button>
        <br />
        <label className="top-spacer" htmlFor="info">
          <b>Info</b>
        </label>
        <br />
        <textarea
          className="three-hundred"
          rows="10"
          cols="30"
          id="info"
          name="info"
          value={info !== "none " ? info : ""}
          onChange={(e) => setInfo(e.target.value)}
        />
        <br />
        <br />
        <div>
          <button
            className="black-button three-hundred"
            title="Save"
            onClick={handleSaveDogClicked}
            disabled={!canSave}
            style={!canSave ? DISABLED_BUTTON_STYLE : null}
          >
            Save
          </button>
          <br />
          <br />
          {dog?.litter?.length && dog?.litter !== "none " && (
            <>
              <button
                className="three-hundred black-button"
                title="Remove Litter"
                onClick={async () =>
                  await updateDog({ id: dog.id, litter: "none " })
                }
              >
                Remove Litter
              </button>
              <br />
              <br />
            </>
          )}
          <button
            className="three-hundred black-button"
            title="Delete"
            onClick={() => setDeletionVisible(!deletionVisible)}
          >
            Delete Dog
          </button>
          {deletionVisible === false ? null : (
            <>
              <br />
              <br />
              <label htmlFor="confirm-delete">
                <b>
                  Type "confirmdelete" and click on the Confirm Deletion button
                  to delete your dog from the database.
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
                title="Confirm Delete Dog"
                disabled={confirmDelete !== "confirmdelete"}
                style={
                  confirmDelete !== "confirmdelete"
                    ? DISABLED_BUTTON_STYLE
                    : null
                }
                onClick={async () => {
                  await deleteDog({ id: dog.id });
                  setConfirmDelete("");
                  setDeletionVisible(false);
                }}
              >
                Confirm Deletion
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default EditDogForm;

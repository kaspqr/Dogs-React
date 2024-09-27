import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAddNewAdvertisementMutation } from "../advertisement-slices/advertisementsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";
import { ADVERTISEMENT_TYPES } from "../../../config/advertisementTypes";
import { CURRENCIES } from "../../../config/currencies";
import { BREEDS } from "../../../config/breeds";
import { regexInputEmptyChanged } from "../../../config/utils";
import { alerts } from "../../../components/alerts";
import {
  PRICE_REGEX,
  TITLE_REGEX,
  DISABLED_BUTTON_STYLE,
  BREEDING_TYPES,
  PRICELESS_TYPES,
} from "../../../config/consts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const NewAdvertisementForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("For Sale");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("$");
  const [country, setCountry] = useState("Argentina");
  const [region, setRegion] = useState("");
  const [breed, setBreed] = useState("");
  const [info, setInfo] = useState("");
  const [previewSource, setPreviewSource] = useState();

  const fileInputRef = useRef(null);

  const [addNewAdvertisement, { isLoading, isSuccess, isError, error }] =
    useAddNewAdvertisementMutation();

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setType("For Sale");
      setPrice("");
      setCurrency("$");
      setCountry("Argentina");
      setRegion("");
      setBreed("");
      setInfo("");
      alerts.successAlert("Advertisement posted");
      navigate("/");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  const canSave = title?.length && type?.length && info?.length && !isLoading &&
    (!PRICELESS_TYPES.includes(type) || (price?.length && currency?.length));

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewSource(reader.result);
  };

  return (
    <>
      <div>
        <p className="advertisement-post-page-title">Post Advertisement</p>
      </div>
      <label htmlFor="title">
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
          onChange={(e) => {
            const file = e.target.files[0];
            previewFile(file);
          }}
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
      <label className="top-spacer" htmlFor="type">
        <b>Type</b>
      </label>
      <br />
      <select
        id="type"
        name="type"
        value={type}
        onChange={(e) => {
          const newType = e.target.value;
          if (PRICELESS_TYPES.includes(newType)) {
            setPrice("");
            setCurrency("");
          } else if (currency === "") setCurrency("$");
          if (!BREEDING_TYPES.includes(newType)) setBreed("");
          setType(newType);
        }}
      >
        {ADVERTISEMENT_TYPES}
      </select>
      <br />
      <label className="top-spacer" htmlFor="breed">
        <b>Breed Required</b>
      </label>
      <br />
      <select
        disabled={!BREEDING_TYPES.includes(type)}
        id="breed"
        name="breed"
        value={breed}
        onChange={(e) => setBreed(e.target.value)}
      >
        <option value="">--</option>
        {BREEDS}
      </select>
      <br />
      <label className="top-spacer" htmlFor="price">
        <b>Price</b>
      </label>
      <br />
      <input
        className="three-hundred"
        type="text"
        id="price"
        name="price"
        value={price}
        disabled={PRICELESS_TYPES.includes(type)}
        onChange={(e) => regexInputEmptyChanged(e, PRICE_REGEX, setPrice)}
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
        disabled={PRICELESS_TYPES.includes(type)}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option disabled={!PRICELESS_TYPES.includes(type)} value="">
          --
        </option>
        {CURRENCIES}
      </select>
      <br />
      <label className="top-spacer" htmlFor="country">
        <b>Country</b>
      </label>
      <br />
      <select
        name="country"
        id="country"
        value={country}
        onChange={(e) => {
          setRegion("");
          setCountry(e.target.value);
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
        <option value="">--</option>
        {BIG_COUNTRIES?.includes(country) && REGIONS[country]}
      </select>
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
        maxLength="500"
        value={info}
        onChange={(e) => setInfo(e.target.value)}
      />
      <br />
      <br />
      <div className="advertisement-post-page-buttons-div">
        <button
          onClick={async () => {
            if (canSave) {
              await addNewAdvertisement({
                poster: userId,
                title,
                price,
                type,
                info,
                currency,
                country,
                region,
                breed,
                image: previewSource,
              });
            }
          }}
          style={!canSave ? DISABLED_BUTTON_STYLE : null}
          className="black-button three-hundred"
          title="Post"
          disabled={!canSave}
        >
          Post
        </button>
      </div>
    </>
  );
};

export default NewAdvertisementForm;

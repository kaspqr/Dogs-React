import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import Swal from "sweetalert2";

import "../../../styles/customCalendar.css";
import { useAddNewDogMutation } from "../dog-slices/dogsApiSlice";
import { BREEDS } from "../../../config/breeds";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";
import { DISABLED_BUTTON_STYLE } from "../../../config/consts";
import useAuth from "../../../hooks/useAuth";
import { regexInputEmptyChanged } from "../../../config/utils";
import { alerts } from "../../../components/alerts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";

const NewDogForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const NAME_REGEX = /^(?!^\s*$)(?:[a-zA-Z']+(\s|$))+$/;
  const CHIPNUMBER_REGEX = /^(?!^\s)(?!.*\s{2,})[\s\S]*$/;

  const [name, setName] = useState("");
  const [heat, setHeat] = useState(false);
  const [sterilized, setSterilized] = useState(false);
  const [birth, setBirth] = useState("");
  const [death, setDeath] = useState("");
  const [breed, setBreed] = useState("Mixed breed");
  const [female, setFemale] = useState(true);
  const [microchipped, setMicrochipped] = useState(false);
  const [chipnumber, setChipnumber] = useState("");
  const [passport, setPassport] = useState(false);
  const [info, setInfo] = useState("");
  const [country, setCountry] = useState("Argentina");
  const [region, setRegion] = useState("none ");

  const [addNewDog, { isLoading, isSuccess, isError, error }] =
    useAddNewDogMutation();

  useEffect(() => {
    if (isSuccess) {
      alerts.successAlert("Dog created");
      setName("");
      setSterilized(false);
      setHeat(false);
      setPassport(false);
      setMicrochipped(false);
      setChipnumber("");
      setBirth("");
      setDeath("");
      setBreed("");
      setInfo("");
      setCountry("");
      setRegion("none ");
      setFemale(true);
      navigate("/dogs");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Creating Dog", "Loading...");
    else Swal.close();
  }, [isLoading]);

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Creating Dog");

  const canSave =
    NAME_REGEX.test(name) &&
    breed.length &&
    typeof birth === "object" &&
    birth !== "" &&
    ((typeof death === "object" && death.getTime() >= birth.getTime()) ||
      death === "");

  const handleSaveDogClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      const finalBirth =
        birth !== "" ? new Date(birth.getTime()).toDateString() : "";
      const finalDeath =
        death !== "" ? new Date(death.getTime()).toDateString() : "";

      await addNewDog({
        name,
        country,
        region,
        breed,
        heat,
        sterilized,
        passport,
        microchipped,
        chipnumber,
        birth: finalBirth,
        death: finalDeath,
        info,
        female,
        user: userId,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSaveDogClicked}>
        <div>
          <p className="register-dog-title">Register Dog</p>
        </div>
        <br />
        <p>
          Fields marked with <b>*</b> are required
        </p>
        <br />
        <label htmlFor="dogname">
          <b>Dog's Name (Max. 30 Characters)*</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          maxLength="30"
          id="dogname"
          name="dogname"
          autoComplete="off"
          required
          value={name}
          onChange={(e) => regexInputEmptyChanged(e, NAME_REGEX, setName)}
        />
        <br />
        <label className="top-spacer" htmlFor="breed">
          <b>Breed*</b>
        </label>
        <br />
        <select
          type="text"
          id="breed"
          name="breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        >
          {BREEDS}
        </select>
        <br />
        <label className="top-spacer" htmlFor="isFemale">
          <b>Good*</b>
        </label>
        <br />
        <select
          onChange={(e) => {
            if (e.target.value === "male") setHeat(false);
            setFemale(e.target.value === "female" ? true : false);
          }}
        >
          <option value="female">Girl</option>
          <option value="male">Boy</option>
        </select>
        <br />
        <label className="top-spacer" htmlFor="country">
          <b>Country*</b>
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
          <option value="none ">--</option>
          {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
        </select>
        <br />
        <label className="top-spacer" htmlFor="passport">
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
        <label className="top-spacer" htmlFor="heat">
          <b>Heat </b>
          <FontAwesomeIcon
            name="heat"
            onClick={female ? () => setHeat((prev) => !prev) : null}
            size="xl"
            icon={heat ? faToggleOn : faToggleOff}
            color={heat ? "rgb(23, 152, 207)" : "grey"}
          />
        </label>
        <br />
        <label className="top-spacer" htmlFor="sterilized">
          <b>Fixed </b>
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
              setChipnumber("");
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
          maxLength="50"
          value={chipnumber}
          onChange={(e) =>
            regexInputEmptyChanged(e, CHIPNUMBER_REGEX, setChipnumber)
          }
        />
        <br />
        <label className="top-spacer" htmlFor="birth">
          <b>Date of Birth*</b>
        </label>
        <br />
        <Calendar
          name="birth"
          maxDate={death || new Date()}
          onChange={(date) => setBirth(date)}
          value={birth}
        />
        <label className="top-spacer" htmlFor="death">
          <b>Date of Death (If Not Alive)</b>
        </label>
        <Calendar
          name="death"
          minDate={birth || null}
          maxDate={new Date()}
          onChange={(date) => setDeath(date)}
          value={death}
        />
        <button
          title="Clear Date"
          className="black-button"
          style={death === "" ? DISABLED_BUTTON_STYLE : null}
          disabled={death === ""}
          onClick={() => setDeath("")}
        >
          Clear Date
        </button>
        <br />
        <label className="top-spacer" htmlFor="info">
          <b>Additional Info</b>
        </label>
        <br />
        <textarea
          className="three-hundred"
          cols="30"
          rows="10"
          maxLength="500"
          id="info"
          name="info"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
        <br />
        <br />
        <div>
          <button
            className="black-button three-hundred"
            style={!canSave ? DISABLED_BUTTON_STYLE : null}
            title="Save"
            disabled={!canSave}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default NewDogForm;

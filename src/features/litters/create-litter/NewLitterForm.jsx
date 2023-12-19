import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";

import { useAddNewLitterMutation } from "../litter-slices/littersApiSlice";
import { useGetDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";
import useAuth from "../../../hooks/useAuth";
import "../../../styles/customCalendar.css";
import { DAY } from "../../../config/consts";
import { alerts } from "../../../components/alerts";
import Swal from "sweetalert2";

const NewLitterForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const PUPPIES_REGEX = /^[1-9]\d{0,1}$/;

  const [mother, setMother] = useState("");
  const [born, setBorn] = useState("");
  const [breed, setBreed] = useState("");
  const [children, setChildren] = useState("");
  const [validMother, setValidMother] = useState(false);
  const [breedOptions, setBreedOptions] = useState(null);
  const [country, setCountry] = useState("Argentina");
  const [region, setRegion] = useState("");

  const {
    data: dogs,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDogsQuery("dogsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    addNewLitter,
    {
      isLoading: isLitterLoading,
      isSuccess: isLitterSuccess,
      isError: isLitterError,
      error: litterError,
    },
  ] = useAddNewLitterMutation();

  useEffect(() => {
    if (isLitterSuccess) {
      setBorn("");
      setMother("");
      setChildren("");
      setCountry("Argentina");
      setRegion("");
    }
  }, [isLitterSuccess, navigate]);

  useEffect(() => {
    if (mother?.length) setValidMother(true);
    else setValidMother(false);
  }, [mother]);

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Fetching Dogs", "Loading...");
    if (isLitterLoading) alerts.loadingAlert("Creating Litter", "Loading...");
    if (!isLoading && !isLitterLoading) Swal.close();
  }, [isLoading, isLitterLoading]);

  const handleMotherChanged = (e) => {
    setBreed("");
    setBorn("");

    const { ids, entities } = dogs;

    const motherId = ids.find((dogId) => entities[dogId].id === e.target.value);
    const mother = entities[motherId];

    if (mother?.breed === "Mixed breed") {
      setBreedOptions(
        <option key="Mixed breed" value="Mixed breed">
          Mixed breed
        </option>
      );
    } else {
      setBreedOptions(
        <>
          <option key="Mixed breed" value="Mixed breed">
            Mixed breed
          </option>
          <option key={mother?.breed} value={mother?.breed}>
            {mother?.breed}
          </option>
        </>
      );
    }

    setMother(e.target.value);
  };

  const canSave =
    validMother &&
    born !== "" &&
    !isLoading &&
    children > 0 &&
    children < 31 &&
    breed !== "" &&
    new Date(born) >= new Date(dogs?.entities[mother]?.birth);

  const handleSaveLitterClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      let finalBorn =
        born !== "" ? new Date(born.getTime()).toDateString() : "";
      await addNewLitter({
        mother,
        born: finalBorn,
        children,
        breed,
        country,
        region,
      });
      navigate("/litters");
    }
  };

  if (!dogs) return;
  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Dogs");
  if (isLitterError)
    alerts.errorAlert(`${litterError?.data?.message}`, "Error Creating Litter");

  if (isSuccess) {
    const { ids, entities } = dogs;

    const filteredIds = ids.filter(
      (dogId) =>
        entities[dogId].user === userId &&
        entities[dogId].female === true &&
        new Date(entities[dogId].birth).getTime() <
          new Date().getTime() - 60 * DAY
    );
    const filteredDogs = filteredIds.map((dogId) => entities[dogId]);

    if (!filteredIds.length)
      return (
        <p>You do not have female dogs who are old enough to have litters</p>
      );

    const ownedDogs = filteredDogs?.length
      ? filteredDogs.map((dog) => (
          <option key={dog.id} value={dog.id}>
            {dog.name}
          </option>
        ))
      : null;

    return (
      <>
        <form onSubmit={handleSaveLitterClicked}>
          <p className="register-litter-page-title">Register Litter</p>
          <br />

          <label htmlFor="mother">
            <b>Litter's Mother</b>
          </label>
          <br />
          <select
            type="text"
            id="mother"
            name="mother"
            value={mother}
            onChange={handleMotherChanged}
          >
            <option id="none" name="none" value="" disabled={true}>
              Select dog
            </option>
            {ownedDogs}
          </select>
          <br />

          <label className="top-spacer" htmlFor="breed">
            <b>Puppies' Breed</b>
          </label>
          <br />
          <select
            type="text"
            id="breed"
            name="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          >
            <option value="" disabled={true}>
              Breed
            </option>
            {breedOptions}
          </select>

          <br />

          <label className="top-spacer" htmlFor="puppies">
            <b>Amount of Puppies Born</b>
          </label>
          <br />
          <input
            className="three-hundred"
            value={children}
            onChange={(e) => {
              if (PUPPIES_REGEX.test(e.target.value) || e.target.value === "") {
                setChildren(e.target.value);
              }
            }}
            type="text"
            name="puppies"
            id="puppies"
            maxLength="2"
          />

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
            {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
          </select>
          <br />

          <label className="top-spacer" htmlFor="born">
            <b>Born</b>
          </label>
          <br />
          <Calendar
            name="born"
            minDate={
              mother?.length
                ? new Date(
                    new Date(dogs?.entities[mother]?.birth).getTime() + 59 * DAY
                  )
                : null
            }
            maxDate={new Date()}
            onChange={(date) => setBorn(date)}
            value={born}
          />
          <br />
        </form>
        <button
          onClick={handleSaveLitterClicked}
          className="black-button three-hundred"
          style={
            !canSave ? { backgroundColor: "grey", cursor: "default" } : null
          }
          title="Save"
          disabled={!canSave}
        >
          Save
        </button>
      </>
    );
  }

  return;
};

export default NewLitterForm;

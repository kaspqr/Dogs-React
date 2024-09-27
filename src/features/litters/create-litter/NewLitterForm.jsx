import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";

import { useAddNewLitterMutation } from "../litter-slices/littersApiSlice";
import { useGetUserDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";
import useAuth from "../../../hooks/useAuth";
import "../../../styles/customCalendar.css";
import { DAY } from "../../../config/consts";
import { alerts } from "../../../components/alerts";

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
  } = useGetUserDogsQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewLitter, {
    isLoading: isLitterLoading,
    isSuccess: isLitterSuccess,
    isError: isLitterError,
    error: litterError,
  }] = useAddNewLitterMutation();

  useEffect(() => {
    if (isLitterSuccess) {
      setBorn("");
      setMother("");
      setChildren("");
      setCountry("Argentina");
      setRegion("");

      navigate("/litters");
    }
  }, [isLitterSuccess, navigate]);

  useEffect(() => {
    setValidMother(mother?.length ? true : false)
  }, [mother]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isLitterError) alerts.errorAlert(`${litterError?.data?.message}`);
  }, [isLitterError])

  if (isLoading || isLitterLoading) return

  const canSave = validMother && born !== "" && !isLoading && children > 0 && children < 31 && breed !== "" &&
    new Date(born) >= new Date(dogs?.entities[mother]?.birth);

  if (isSuccess) {
    const { ids, entities } = dogs;

    if (!ids) return

    const filteredIds = ids.filter((id) =>
      entities[id].female === true && new Date(entities[id].birth).getTime() < new Date().getTime() - 60 * DAY
    );

    if (!filteredIds.length) return <p>You do not have female dogs who are old enough to have litters</p>

    return (
      <>
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
          onChange={(e) => {
            setBreed("");
            setBorn("");
            const mother = entities[e.target.value];
        
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
          }}
        >
          <option id="none" name="none" value="" disabled={true}>
            Select dog
          </option>
          {!filteredIds?.length ? null : filteredIds.map((id) => (
            <option key={id} value={id}>
              {entities[id]?.name}
            </option>
          ))}
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
          minDate={mother?.length ? new Date(new Date(dogs?.entities[mother]?.birth).getTime() + 59 * DAY) : null}
          maxDate={new Date()}
          onChange={(date) => setBorn(date)}
          value={born}
        />
        <br />
        <button
          onClick={async () => {
            if (canSave) {
              const finalBorn = born !== "" ? new Date(born.getTime()).toDateString() : "";

              await addNewLitter({
                mother,
                born: finalBorn,
                children,
                breed,
                country,
                region,
              });
            }
          }}
          className="black-button three-hundred"
          style={!canSave ? { backgroundColor: "grey", cursor: "default" } : null}
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

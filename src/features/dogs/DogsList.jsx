import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";

import { useGetDogsQuery } from "./dog-slices/dogsApiSlice";
import Dog from "./dog-components/Dog";

import useAuth from "../../hooks/useAuth";
import { COUNTRIES } from "../../config/countries";
import { BIG_COUNTRIES } from "../../config/bigCountries";
import { REGIONS } from "../../config/regions";
import { BREEDS } from "../../config/breeds";
import "../../styles/customCalendar.css";
import { alerts } from "../../components/alerts";
import Pagination from "../../components/Pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const DogsList = () => {
  const { userId } = useAuth();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [breed, setBreed] = useState("");
  const [chipnumber, setChipnumber] = useState("");
  const [gender, setGender] = useState("");
  const [heat, setHeat] = useState("");
  const [chipped, setChipped] = useState("");
  const [passport, setPassport] = useState("");
  const [fixed, setFixed] = useState("");
  const [bornEarliest, setBornEarliest] = useState("");
  const [bornLatest, setBornLatest] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);

  const [queryParams, setQueryParams] = useState({
    name: "",
    breed: "",
    bornEarliest: "",
    bornLatest: "",
    country: "",
    region: "",
    passport: "",
    isFixed: "",
    female: "",
    heat: "",
    chipped: "",
    chipnumber: "",
    page: 1
  });

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDogsQuery(queryParams, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setQueryParams({
      name,
      breed,
      bornEarliest: bornEarliest !== "" ? new Date(bornEarliest.getTime()).toDateString() : "",
      bornLatest: bornLatest !== "" ? new Date(bornLatest.getTime()).toDateString() : "",
      country,
      region,
      passport: passport === "" ? "" : passport === 'yes' ? true : false,
      isFixed: fixed === "" ? "" : fixed === 'yes' ? true : false,
      female: gender === "" ? "" : gender === 'female' ? true : false,
      heat: heat === "" ? "" : heat === 'yes' ? true : false,
      chipped: chipped === "" ? "" : chipped === 'yes' ? true : false,
      chipnumber,
      page: currentPage
    })
  }, [currentPage])

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    const { dogs, totalPages } = data;

    return (
      <>
        {userId?.length && <>
          <Link to={"/dogs/new"}>
            <button title="Add a New Dog" className="black-button three-hundred">
              Add a New Dog
            </button>
          </Link>
          <br />
          <br />
        </>}
        <button
          title="Toggle Search View"
          className="black-button three-hundred"
          onClick={() => setInputsVisible(!inputsVisible)}
        >
          Toggle Search View
        </button>
        <br />
        <br />
        <div style={{ display: inputsVisible ? "block" : "none" }}>
          <label htmlFor="dog-name-search-input">
            <b>Name</b>
          </label>
          <br />
          <input
            className="three-hundred"
            value={name}
            name="dog-name-search-input"
            id="dog-name-search-input"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <label className="top-spacer" htmlFor="dogs-filter-breed-select">
            <b>Breed</b>
          </label>
          <br />
          <select
            onChange={(e) => setBreed(e.target.value)}
            value={breed}
            name="dogs-filter-breed-select"
            id="dogs-filter-breed-select"
          >
            <option value="">--</option>
            {BREEDS}
          </select>
          <br />
          <label
            className="top-spacer"
            htmlFor="born-at-earliest-calendar-input"
          >
            <b>Born at Earliest</b>
          </label>
          <br />
          <Calendar
            name="born-at-earliest-calendar-input"
            maxDate={bornLatest || new Date()}
            onChange={(date) => setBornEarliest(date)}
            value={bornEarliest}
          />
          <button
            title="Clear Date for Born at Earliest"
            className="black-button"
            disabled={bornEarliest === ""}
            style={
              bornEarliest === ""
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
            onClick={() => setBornEarliest("")}
          >
            Clear Date
          </button>
          <br />
          <label
            className="top-spacer"
            htmlFor="born-at-latest-calendar-input"
          >
            <b>Born at Latest</b>
          </label>
          <br />
          <Calendar
            name="born-at-latest-calendar-input"
            minDate={bornEarliest || null}
            maxDate={new Date()}
            onChange={(date) => setBornLatest(date)}
            value={bornLatest}
          />
          <button
            title="Clear Date for Born at Latest"
            className="black-button"
            disabled={bornLatest === ""}
            style={
              bornLatest === ""
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
            onClick={() => setBornLatest("")}
          >
            Clear Date
          </button>
          <br />
          <label className="top-spacer" htmlFor="dog-country">
            <b>Country</b>
          </label>
          <br />
          <select
            value={country}
            name="dog-country"
            id="dog-country"
            onChange={(e) => {
              setRegion("");
              setCountry(e.target.value);
            }}
          >
            <option value="">--</option>
            {COUNTRIES}
          </select>
          <br />
          <label className="top-spacer" htmlFor="dog-region">
            <b>Region</b>
          </label>
          <br />
          <select
            disabled={!BIG_COUNTRIES?.includes(country)}
            value={region}
            name="dog-region"
            id="dog-region"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">--</option>
            {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
          </select>
          <br />
          <label className="top-spacer" htmlFor="passport">
            <b>Passport</b>
          </label>
          <br />
          <select
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            name="passport"
            id="passport"
          >
            <option value="">--</option>
            <option value="yes">Documented</option>
            <option value="no">Not Documented</option>
          </select>
          <br />
          <label className="top-spacer" htmlFor="fixed">
            <b>Fixed</b>
          </label>
          <br />
          <select
            value={fixed}
            onChange={(e) => setFixed(e.target.value)}
            name="fixed"
            id="fixed"
          >
            <option value="">--</option>
            <option value="yes">Fixed</option>
            <option value="no">Not Fixed</option>
          </select>
          <br />
          <label className="top-spacer" htmlFor="gender">
            <b>Good</b>
          </label>
          <br />
          <select
            value={gender}
            onChange={(e) => {
              if (e.target.value !== "female") setHeat("");
              setGender(e.target.value);
            }}
            name="gender"
            id="gender"
          >
            <option value="">--</option>
            <option value="female">Girl</option>
            <option value="male">Boy</option>
          </select>
          <br />
          <label className="top-spacer" htmlFor="heat">
            <b>Currently in Heat</b>
          </label>
          <br />
          <select
            disabled={gender !== "female"}
            value={heat}
            onChange={(e) => setHeat(e.target.value)}
            name="heat"
            id="heat"
          >
            <option value="">--</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <br />
          <label className="top-spacer" htmlFor="chipped">
            <b>Chipped</b>
          </label>
          <br />
          <select
            value={chipped}
            onChange={(e) => {
              if (e.target.value !== "yes") setChipnumber("");
              setChipped(e.target.value);
            }}
            name="chipped"
            id="chipped"
          >
            <option value="">--</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <br />
          <label className="top-spacer" htmlFor="chipnumber">
            <b>Chipnumber</b>
          </label>
          <br />
          <input
            className="three-hundred"
            disabled={chipped !== "yes"}
            value={chipnumber}
            onChange={(e) => setChipnumber(e.target.value)}
            name="chipnumber"
            id="chipnumber"
          />
          <br />
          <br />
          <button
            title="Search"
            onClick={() => {
              setNewPage("")
              setCurrentPage(1)

              setQueryParams({
                name,
                breed,
                bornEarliest: bornEarliest !== "" ? new Date(bornEarliest.getTime()).toDateString() : "",
                bornLatest: bornLatest !== "" ? new Date(bornLatest.getTime()).toDateString() : "",
                country,
                region,
                passport: passport === "" ? "" : passport === 'yes' ? true : false,
                isFixed: fixed === "" ? "" : fixed === 'yes' ? true : false,
                female: gender === "" ? "" : gender === 'female' ? true : false,
                heat: heat === "" ? "" : heat === 'yes' ? true : false,
                chipped: chipped === "" ? "" : chipped === 'yes' ? true : false,
                chipnumber,
                page: 1
              })
            }}
            className="black-button search-button three-hundred"
          >
            Search{" "}
            <FontAwesomeIcon
              color="rgb(235, 155, 52)"
              icon={faMagnifyingGlass}
            />
          </button>
          <br />
          <br />
        </div>
        {!dogs?.ids?.length
          ? <p>No dogs match your search</p>
          : <>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              newPage={newPage}
              setNewPage={setNewPage}
              totalPages={totalPages}
              topPosition={true}
            />
            <br />
            {dogs?.ids?.map((dogId) => (
              <Dog key={dogId} dogId={dogId} />
            ))}
            <br />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              newPage={newPage}
              setNewPage={setNewPage}
              totalPages={totalPages}
              topPosition={false}
            />
          </>
        }
      </>
    );
  }

  return
};

export default DogsList;

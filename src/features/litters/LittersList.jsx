import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";

import { useGetLittersQuery } from "./litter-slices/littersApiSlice";
import Litter from "./Litter";
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

const LittersList = () => {
  const { userId } = useAuth();

  const [bornEarliest, setBornEarliest] = useState("");
  const [bornLatest, setBornLatest] = useState("");
  const [lowestPuppies, setLowestPuppies] = useState("");
  const [highestPuppies, setHighestPuppies] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [breed, setBreed] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);

  const PUPPIES_AMOUNT_REGEX = /^[1-9]\d{0,1}$/;

  const [queryParams, setQueryParams] = useState({
    bornEarliest: "",
    bornLatest: "",
    breed: "",
    country: "",
    region: "",
    lowestPuppies: "",
    highestPuppies: "",
    currentPage: 1
  });

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLittersQuery(queryParams, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setQueryParams({
      bornEarliest: bornEarliest !== "" ? new Date(bornEarliest.getTime()).toDateString() : "",
      bornLatest: bornLatest !== "" ? new Date(bornLatest.getTime()).toDateString() : "",
      breed,
      country,
      region,
      lowestPuppies,
      highestPuppies,
      currentPage
    });
  }, [currentPage])

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Litters");
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    const { litters, totalPages } = data;

    return (
      <>
        {userId?.length && <>
          <Link to={"/litters/new"}>
            <button
              title="Add a New Litter"
              className="black-button three-hundred"
            >
              Add a New Litter
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
          <label htmlFor="born-at-earliest">
            <b>Born at Earliest</b>
          </label>
          <br />
          <Calendar
            name="born-at-earliest"
            maxDate={bornLatest || new Date()}
            onChange={(date) => setBornEarliest(date)}
            value={bornEarliest}
          />
          <button
            title="Clear Date for Born at Earliest"
            className="black-button"
            disabled={bornEarliest === ""}
            style={bornEarliest === "" ? { backgroundColor: "grey", cursor: "default" } : null}
            onClick={() => setBornEarliest("")}
          >
            Clear Date
          </button>
          <br />
          <label className="top-spacer" htmlFor="born-at-latest">
            <b>Born at Latest</b>
          </label>
          <br />
          <Calendar
            name="born-at-latest"
            minDate={bornEarliest || null}
            maxDate={new Date()}
            onChange={(date) => setBornLatest(date)}
            value={bornLatest}
          />
          <button
            title="Clear Date for Born at Latest"
            className="black-button"
            disabled={bornLatest === ""}
            style={bornLatest === "" ? { backgroundColor: "grey", cursor: "default" } : null}
            onClick={() => setBornLatest("")}
          >
            Clear Date
          </button>
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
          <label className="top-spacer" htmlFor="litter-country">
            <b>Country</b>
          </label>
          <br />
          <select
            value={country}
            name="litter-country"
            id="litter-country"
            onChange={(e) => {
              setRegion("");
              setCountry(e.target.value);
            }}
          >
            <option value="">--</option>
            {COUNTRIES}
          </select>
          <br />
          <label className="top-spacer" htmlFor="litter-region">
            <b>Region</b>
          </label>
          <br />
          <select
            disabled={!BIG_COUNTRIES.includes(country)}
            value={region}
            name="litter-region"
            id="litter-region"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">--</option>
            {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
          </select>
          <br />
          <label
            className="top-spacer"
            htmlFor="litter-lowest-puppies-search-input"
          >
            <b>Lowest Amount of Puppies</b>
          </label>
          <br />
          <input
            className="three-hundred"
            type="text"
            value={lowestPuppies}
            name="litter-lowest-puppies-search-input"
            id="litter-lowest-puppies-search-input"
            onChange={(e) => {
              if (PUPPIES_AMOUNT_REGEX.test(e.target.value) || e.target.value === "") {
                setLowestPuppies(e.target.value);
              }
            }}
          />
          <br />
          <label
            className="top-spacer"
            htmlFor="litter-highest-puppies-search-input"
          >
            <b>Highest Amount of Puppies</b>
          </label>
          <br />
          <input
            className="three-hundred"
            type="text"
            value={highestPuppies}
            name="litter-highest-puppies-search-input"
            id="litter-highest-puppies-search-input"
            onChange={(e) => {
              if (PUPPIES_AMOUNT_REGEX.test(e.target.value) || e.target.value === "") {
                setHighestPuppies(e.target.value);
              }
            }}
          />
          <br />
          <br />
          <button
            title="Search"
            onClick={() => {
              setCurrentPage(1)
              setNewPage("")

              setQueryParams({
                bornEarliest: bornEarliest !== "" ? new Date(bornEarliest.getTime()).toDateString() : "",
                bornLatest: bornLatest !== "" ? new Date(bornLatest.getTime()).toDateString() : "",
                breed,
                country,
                region,
                lowestPuppies,
                highestPuppies,
                currentPage
              });
            }}
            className="three-hundred black-button search-button"
            disabled={lowestPuppies?.length && highestPuppies?.length && parseInt(lowestPuppies) > parseInt(highestPuppies)}
            style={
              lowestPuppies?.length &&
              highestPuppies?.length &&
              parseInt(lowestPuppies) > parseInt(highestPuppies)
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
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
        {!litters?.ids?.length
          ? <p>No litters match your search</p>
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
            {litters?.ids.map((litterId) => (
              <Litter key={litterId} litterId={litterId} />
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

export default LittersList;

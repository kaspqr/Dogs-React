import { useState, useEffect } from "react";

import { useGetUsersQuery } from "./user-slices/usersApiSlice";
import User from "./User";
import { COUNTRIES } from "../../config/countries";
import { BIG_COUNTRIES } from "../../config/bigCountries";
import { REGIONS } from "../../config/regions";
import { alerts } from "../../components/alerts";
import Pagination from "../../components/Pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const UsersList = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);

  const [queryParams, setQueryParams] = useState({
    username: "",
    country: "",
    region: "",
  });

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(queryParams, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setQueryParams({ username, country, region })
  }, [currentPage])

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  if (isLoading) return

  if (isSuccess) {
    const { users, totalPages } = data
    const { ids } = users

    return (
      <>
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
          <label htmlFor="user-username-search-input">
            <b>Username</b>
          </label>
          <br />
          <input
            className="three-hundred"
            type="text"
            value={username}
            name="user-username-search-input"
            id="user-username-search-input"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label className="top-spacer" htmlFor="user-country">
            <b>Country</b>
          </label>
          <br />
          <select
            value={country}
            name="user-country"
            id="user-country"
            onChange={(e) => {
              setRegion("");
              setCountry(e.target.value);
            }}
          >
            <option value="">--</option>
            {COUNTRIES}
          </select>
          <br />
          <label className="top-spacer" htmlFor="user-region">
            <b>Region</b>
          </label>
          <br />
          <select
            disabled={!BIG_COUNTRIES.includes(country)}
            value={region}
            name="user-region"
            id="user-region"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">--</option>
            {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
          </select>
          <br />
          <br />
          <button
            title="Search"
            onClick={() => {
              setCurrentPage(1);
              setNewPage("")

              setQueryParams({
                username,
                country,
                region
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
        {!ids?.length
          ? <p>No users match your search</p>
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
            {ids?.map((userId) => (
              <User key={userId} userId={userId} />
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

export default UsersList;

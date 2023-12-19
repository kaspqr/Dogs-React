import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { useGetUsersQuery } from "./user-slices/usersApiSlice";
import User from "./User";
import { COUNTRIES } from "../../config/countries";
import { BIG_COUNTRIES } from "../../config/bigCountries";
import { REGIONS } from "../../config/regions";
import { filterUsers } from "../utils/users.utils";
import { alerts } from "../../components/alerts";
import Pagination from "../../components/Pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const UsersList = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [filteredIds, setFilteredIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Loading Users", "Loading...");
    else Swal.close();
  }, [isLoading]);

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Users");

  if (isSuccess) {
    const reversedNewIds = Object.values(users?.entities)
      ?.reverse()
      .map((user) => {
        return user._id;
      });

    if (!reversedNewIds?.length)
      return <p>There are currently no active users</p>;

    const itemsPerPage = 20;

    const maxPage = Math.ceil(
      filteredIds?.length
        ? filteredIds?.length / itemsPerPage
        : reversedNewIds?.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const usersToDisplay = filteredIds?.length
      ? filteredIds.slice(startIndex, endIndex)
      : reversedNewIds.slice(startIndex, endIndex);

    const tableContent = usersToDisplay.map((userId) => (
      <User key={userId} userId={userId} />
    ));

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
          <form onSubmit={(e) => e.preventDefault()}>
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
          </form>
          <button
            title="Search"
            onClick={() => {
              setCurrentPage(1);
              const filteredUserIds = filterUsers({
                users,
                username,
                region,
                country,
              });
              setFilteredIds(filteredUserIds || []);
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
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          newPage={newPage}
          setNewPage={setNewPage}
          maxPage={maxPage}
          topPosition={true}
        />
        <br />
        {tableContent}
        <br />
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          newPage={newPage}
          setNewPage={setNewPage}
          maxPage={maxPage}
          topPosition={false}
        />
      </>
    );
  }
};

export default UsersList;

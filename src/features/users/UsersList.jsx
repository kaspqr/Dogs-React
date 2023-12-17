import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { useGetUsersQuery } from "./user-slices/usersApiSlice";
import User from "./User";
import { COUNTRIES } from "../../config/countries";
import { BIG_COUNTRIES } from "../../config/bigCountries";
import { REGIONS } from "../../config/regions";
import { filterUsers } from "../utils/users.utils";
import { alerts } from "../../components/alerts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const UsersList = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [filteredIds, setFilteredIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    if (isLoading) alerts.loadingAlert("Loading advertisements", "Loading...");
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
    const goToPageButtonDisabled =
      newPage < 1 || newPage > maxPage || parseInt(newPage) === currentPage;

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
        <p>
          <button
            title="Go to Previous Page"
            style={currentPage === 1 ? { display: "none" } : null}
            disabled={currentPage === 1}
            className="pagination-button"
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
          </button>
          {` Page ${currentPage} of ${maxPage} `}
          <button
            title="Go to Next Page"
            className="pagination-button"
            style={currentPage === maxPage ? { display: "none" } : null}
            disabled={currentPage === maxPage}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
          </button>
          {windowWidth > 600 || maxPage === 1 ? null : (
            <>
              <br />
              <br />
            </>
          )}
          <span
            className="new-page-input-span"
            style={
              maxPage === 1
                ? { display: "none" }
                : windowWidth > 600
                ? null
                : { float: "none" }
            }
          >
            <label className="off-screen" htmlFor="page-number">
              Page Number
            </label>
            <input
              name="page-number"
              onChange={(e) => setNewPage(e.target.value)}
              value={newPage}
              type="number"
              className="new-page-input"
              placeholder="Page no."
            />
            <button
              title="Go to the Specified Page"
              style={
                goToPageButtonDisabled
                  ? { backgroundColor: "grey", cursor: "default" }
                  : null
              }
              disabled={goToPageButtonDisabled}
              onClick={() => {
                if (newPage >= 1 && newPage <= maxPage) {
                  setCurrentPage(parseInt(newPage));
                }
              }}
              className="black-button"
            >
              Go to Page
            </button>
          </span>
        </p>
        <br />
        {tableContent}
        <br />
        <p>
          <button
            title="Go to Previous Page"
            style={currentPage === 1 ? { display: "none" } : null}
            disabled={currentPage === 1}
            className="pagination-button"
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
          </button>
          {` Page ${currentPage} of ${maxPage} `}
          <button
            title="Go to Next Page"
            className="pagination-button"
            style={currentPage === maxPage ? { display: "none" } : null}
            disabled={currentPage === maxPage}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
          </button>
          {windowWidth > 600 || maxPage === 1 ? null : (
            <>
              <br />
              <br />
            </>
          )}
          <span
            className="new-page-input-span"
            style={
              maxPage === 1
                ? { display: "none" }
                : windowWidth > 600
                ? null
                : { float: "none" }
            }
          >
            <label className="off-screen" htmlFor="another-page-number">
              Page Number
            </label>
            <input
              name="another-page-number"
              onChange={(e) => setNewPage(e.target.value)}
              value={newPage}
              type="number"
              className="new-page-input"
              placeholder="Page no."
            />
            <button
              title="Go to the Specified Page"
              style={
                goToPageButtonDisabled
                  ? { backgroundColor: "grey", cursor: "default" }
                  : null
              }
              disabled={goToPageButtonDisabled}
              onClick={() => {
                if (newPage >= 1 && newPage <= maxPage) {
                  setCurrentPage(parseInt(newPage));
                }
              }}
              className="black-button"
            >
              Go to Page
            </button>
          </span>
        </p>
      </>
    );
  }
};

export default UsersList;

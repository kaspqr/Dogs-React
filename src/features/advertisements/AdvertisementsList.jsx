import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetAdvertisementsQuery } from "./advertisement-slices/advertisementsApiSlice";
import Advertisement from "./components/Advertisement";
import Pagination from "./components/Pagination";
import useAuth from "../../hooks/useAuth";
import { ADVERTISEMENT_TYPES } from "../../config/advertisementTypes";
import { COUNTRIES } from "../../config/countries";
import { BIG_COUNTRIES } from "../../config/bigCountries";
import { REGIONS } from "../../config/regions";
import { CURRENCIES } from "../../config/currencies";
import { BREEDS } from "../../config/breeds";
import { PRICELESS_TYPES, BREEDING_TYPES } from "../../config/consts";
import { regexInputEmptyChanged } from "../../config/utils";
import { alerts } from "../../components/alerts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { filterAdvertisements } from "../utils/advertisements.utils";

const AdvertisementsList = () => {
  const { userId } = useAuth();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [currency, setCurrency] = useState("");
  const [breed, setBreed] = useState("");
  const [lowestPrice, setLowestPrice] = useState("");
  const [highestPrice, setHighestPrice] = useState("");
  const [filteredIds, setFilteredIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [sort, setSort] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);

  const {
    data: advertisements,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAdvertisementsQuery("advertisementsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Loading advertisements", "Loading...");
    else Swal.close();
  }, [isLoading]);

  const PRICE_REGEX = /^[1-9]\d{0,11}$/;
  const currencyDisabled = type === "Found" || type === "Lost" || type === "";

  const handleCountryChanged = (e) => {
    setRegion("");
    setCountry(e.target.value);
  };

  const handleCurrencyChanged = (e) => {
    if (e.target.value === "") {
      setLowestPrice("");
      setHighestPrice("");
      setSort("");
    }
    setCurrency(e.target.value);
  };

  const handleTypeChanged = (e) => {
    const newType = e.target.value;
    if (newType === "" || PRICELESS_TYPES.includes(newType)) {
      setCurrency("");
      setLowestPrice("");
      setHighestPrice("");
      setSort("");
    }
    if (!BREEDING_TYPES.includes(newType)) setBreed("");
    setType(newType);
  };

  const handleSearchClicked = () => {
    if (
      lowestPrice?.length &&
      highestPrice?.length &&
      highestPrice < lowestPrice
    ) {
      alerts.errorAlert("Highest price cannot be lower than lowest price");
      return;
    }

    setCurrentPage(1);

    const filteredAdvertisementIds = filterAdvertisements({
      advertisements,
      title,
      region,
      country,
      type,
      breed,
      currency,
      lowestPrice,
      highestPrice,
      sort,
    });

    setFilteredIds(filteredAdvertisementIds || []);
  };

  if (isError)
    alerts.errorAlert(
      `${error?.data?.message}`,
      "Error Fetching Advertisements"
    );

  if (isSuccess) {
    const reversedNewIds = Object.values(advertisements?.entities)
      ?.reverse()
      .map((ad) => {
        return ad._id;
      });

    const itemsPerPage = 20;

    const maxPage = Math.ceil(
      filteredIds?.length
        ? filteredIds?.length / itemsPerPage
        : reversedNewIds?.length / itemsPerPage
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const advertisementsToDisplay = filteredIds?.length
      ? filteredIds.slice(startIndex, endIndex)
      : reversedNewIds.slice(startIndex, endIndex);

    const tableContent = advertisementsToDisplay.map((advertisementId) => (
      <Advertisement key={advertisementId} advertisementId={advertisementId} />
    ));

    return (
      <>
        {userId?.length && (
          <>
            <Link to={"/advertisements/new"}>
              <button
                title="Post an Advertisement"
                className="black-button three-hundred"
              >
                Post an Advertisement
              </button>
            </Link>

            <br />
            <br />
          </>
        )}
        {!reversedNewIds?.length ? (
          <p>There are currently no advertisements</p>
        ) : (
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
                <label htmlFor="advertisement-title-search-input">
                  <b>Title</b>
                </label>
                <br />
                <input
                  className="three-hundred"
                  value={title}
                  name="advertisement-title-search-input"
                  id="advertisement-title-search-input"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <label className="top-spacer" htmlFor="advertisement-type">
                  <b>Type</b>
                </label>
                <br />
                <select
                  value={type}
                  name="advertisement-type"
                  id="advertisement-type"
                  onChange={handleTypeChanged}
                >
                  <option value="">--</option>
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
                <label className="top-spacer" htmlFor="advertisement-country">
                  <b>Country</b>
                </label>
                <br />
                <select
                  value={country}
                  name="advertisement-country"
                  id="advertisement-country"
                  onChange={handleCountryChanged}
                >
                  <option value="">--</option>
                  {COUNTRIES}
                </select>
                <br />
                <label className="top-spacer" htmlFor="advertisement-region">
                  <b>Region</b>
                </label>
                <br />
                <select
                  disabled={!BIG_COUNTRIES.includes(country)}
                  value={region}
                  name="advertisement-region"
                  id="advertisement-region"
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="">--</option>
                  {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
                </select>
                <br />
                <label className="top-spacer" htmlFor="advertisement-currency">
                  <b>Currency</b>
                </label>
                <br />
                <select
                  value={currency}
                  name="advertisement-currency"
                  id="advertisement-currency"
                  onChange={handleCurrencyChanged}
                  disabled={currencyDisabled}
                >
                  <option value="">--</option>
                  {CURRENCIES}
                </select>
                <br />
                <label
                  className="top-spacer"
                  htmlFor="advertisement-lowest-price"
                >
                  <b>Lowest Price</b>
                </label>
                <br />
                <input
                  className="three-hundred"
                  type="text"
                  value={lowestPrice}
                  name="advertisement-lowest-price"
                  id="advertisement-lowest-price"
                  onChange={(e) =>
                    regexInputEmptyChanged(e, PRICE_REGEX, setLowestPrice)
                  }
                  disabled={!currency?.length}
                />
                <br />
                <label
                  className="top-spacer"
                  htmlFor="advertisement-highest-price"
                >
                  <b>Highest Price</b>
                </label>
                <br />
                <input
                  className="three-hundred"
                  type="text"
                  value={highestPrice}
                  name="advertisement-highest-price"
                  id="advertisement-highest-price"
                  onChange={(e) =>
                    regexInputEmptyChanged(e, PRICE_REGEX, setHighestPrice)
                  }
                  disabled={!currency?.length}
                />
                <br />
                <label className="top-spacer" htmlFor="sort-by-price">
                  <b>Sort by Price</b>
                </label>
                <br />
                <select
                  value={sort}
                  name="sort-by-price"
                  id="sort-by-price"
                  onChange={(e) => setSort(e.target.value)}
                  disabled={!currency?.length}
                >
                  <option value="">--</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </form>
              <br />
              <button
                onClick={handleSearchClicked}
                className="black-button search-button three-hundred"
                title="Search"
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
        )}
      </>
    );
  }

  return;
};

export default AdvertisementsList;

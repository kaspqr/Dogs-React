import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useGetAdvertisementsQuery } from "./advertisement-slices/advertisementsApiSlice";
import Advertisement from "./components/Advertisement";
import Pagination from "../../components/Pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [newPage, setNewPage] = useState("");
  const [sort, setSort] = useState("");
  const [inputsVisible, setInputsVisible] = useState(false);

  const [queryParams, setQueryParams] = useState({
    title: "",
    type: "",
    breed: "",
    country: "",
    region: "",
    currency: "",
    lowestPrice: "",
    highestPrice: "",
    sort: "",
    currentPage: 1
  });

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementsQuery(queryParams, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const PRICE_REGEX = /^[1-9]\d{0,11}$/;

  useEffect(() => {
    if (lowestPrice?.length && highestPrice?.length && highestPrice < lowestPrice) {
      alerts.errorAlert("Highest price cannot be lower than lowest price");
      return;
    }

    setQueryParams({
      title,
      type,
      breed,
      country,
      region,
      currency,
      lowestPrice,
      highestPrice,
      sort,
      currentPage
    });
  }, [currentPage])

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Advertisements");
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    const { advertisements, totalPages } = data;

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
                onChange={(e) => {
                  const newType = e.target.value;
                  if (newType === "" || PRICELESS_TYPES.includes(newType)) {
                    setCurrency("");
                    setLowestPrice("");
                    setHighestPrice("");
                    setSort("");
                  }
                  if (!BREEDING_TYPES.includes(newType)) setBreed("");
                  setType(newType);
                }}
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
                onChange={(e) => {
                  setRegion("");
                  setCountry(e.target.value);
                }}
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
                onChange={(e) => {
                  if (e.target.value === "") {
                    setLowestPrice("");
                    setHighestPrice("");
                    setSort("");
                  }
                  setCurrency(e.target.value);
                }}
                disabled={type === "Found" || type === "Lost" || type === ""}
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
              onClick={() => {
                if (lowestPrice?.length && highestPrice?.length && highestPrice < lowestPrice) {
                  alerts.errorAlert("Highest price cannot be lower than lowest price");
                  return;
                }

                setCurrentPage(1)
                setNewPage("")
            
                setQueryParams({
                  title,
                  type,
                  breed,
                  country,
                  region,
                  currency,
                  lowestPrice,
                  highestPrice,
                  sort,
                  currentPage
                });
              }}
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
          {!advertisements?.ids?.length ? <p>No advertisements match your search</p> : (
            <>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                newPage={newPage}
                setNewPage={setNewPage}
                totalPages={totalPages}
                topPosition={true}
              />
              <br />
              {advertisements?.ids?.map((advertisementId) => (
                <Advertisement
                  key={advertisementId}
                  advertisement={advertisements?.entities[advertisementId]}
                />
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
          )}
        </>
      </>
    );
  }

  return;
};

export default AdvertisementsList;

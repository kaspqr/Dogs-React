import { useEffect, useState } from "react";

import UserAdvertisement from "../../advertisements/components/UserAdvertisement";
import { useGetAdvertisementsQuery } from "../../advertisements/advertisement-slices/advertisementsApiSlice";
import { alerts } from "../../../components/alerts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const AdvertisementsTable = ({ userId, user, windowWidth }) => {
  const [currentAdvertisementPage, setCurrentAdvertisementPage] = useState(1);
  const [newAdvertisementPage, setNewAdvertisementPage] = useState("");

  useEffect(() => {
    setCurrentAdvertisementPage(1);
    setNewAdvertisementPage("");
  }, [user]);

  const {
    data: advertisements,
    isSuccess,
    isError,
    error,
  } = useGetAdvertisementsQuery("advertisementsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Ads");

  if (isSuccess) {
    const { ids: advertisementIds, entities: advertisementEntities } =
      advertisements;

    const filteredAdvertisementIds = advertisementIds?.filter(
      (advertisementId) =>
        advertisementEntities[advertisementId]?.poster === user?.id
    );

    if (!filteredAdvertisementIds.length) return;

    const itemsPerAdvertisementPage = 5;
    const maxAdvertisementPage = Math.ceil(
      filteredAdvertisementIds?.length
        ? filteredAdvertisementIds?.length / itemsPerAdvertisementPage
        : 1
    );

    const startAdvertisementIndex =
      (currentAdvertisementPage - 1) * itemsPerAdvertisementPage;
    const endAdvertisementIndex =
      startAdvertisementIndex + itemsPerAdvertisementPage;

    const advertisementsToDisplay = filteredAdvertisementIds?.length
      ? filteredAdvertisementIds.slice(
          startAdvertisementIndex,
          endAdvertisementIndex
        )
      : null;

    const tableAdvertisementContent = advertisementsToDisplay?.map(
      (advertisementId) => (
        <UserAdvertisement
          key={advertisementId}
          advertisementId={advertisementId}
        />
      )
    );

    const goToAdvertisementPageButtonDisabled =
      newAdvertisementPage < 1 ||
      newAdvertisementPage > maxAdvertisementPage ||
      parseInt(newAdvertisementPage) === currentAdvertisementPage;

    return (
      <>
        <p>
          <b>
            {filteredAdvertisementIds?.length} Active Advertisement
            {filteredAdvertisementIds?.length === 1 ? null : "s"}
          </b>
        </p>
        <br />
        <p>
          <button
            title="Go to Previous Advertisements Page"
            style={currentAdvertisementPage === 1 ? { display: "none" } : null}
            disabled={currentAdvertisementPage === 1}
            className="pagination-button"
            onClick={() => {
              setCurrentAdvertisementPage(currentAdvertisementPage - 1);
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
          </button>

          {` Page ${currentAdvertisementPage} of ${maxAdvertisementPage} `}

          <button
            title="Go to Next Advertisement Page"
            className="pagination-button"
            style={
              currentAdvertisementPage === maxAdvertisementPage
                ? { display: "none" }
                : null
            }
            disabled={currentAdvertisementPage === maxAdvertisementPage}
            onClick={() => {
              setCurrentAdvertisementPage(currentAdvertisementPage + 1);
            }}
          >
            <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
          </button>

          {windowWidth > 600 || maxAdvertisementPage === 1 ? null : (
            <>
              <br />
              <br />
            </>
          )}

          <span
            className="new-page-input-span"
            style={
              maxAdvertisementPage === 1
                ? { display: "none" }
                : windowWidth > 600
                ? null
                : { float: "none" }
            }
          >
            <label
              htmlFor="new-advertisement-page-input"
              className="off-screen"
            >
              Advertisements Page Number
            </label>
            <input
              name="new-advertisement-page-input"
              onChange={(e) => setNewAdvertisementPage(e.target.value)}
              value={newAdvertisementPage}
              type="number"
              className="new-page-input"
              placeholder="Page no."
            />
            <button
              title="Go to the Specified Advertisements Page"
              style={
                goToAdvertisementPageButtonDisabled
                  ? { backgroundColor: "grey", cursor: "default" }
                  : null
              }
              disabled={goToAdvertisementPageButtonDisabled}
              onClick={() => {
                if (
                  newAdvertisementPage >= 1 &&
                  newAdvertisementPage <= maxAdvertisementPage
                ) {
                  setCurrentAdvertisementPage(parseInt(newAdvertisementPage));
                }
              }}
              className="black-button"
            >
              Go to Page
            </button>
          </span>
        </p>

        <br />
        {tableAdvertisementContent}
        <br />
      </>
    );
  }

  return;
};

export default AdvertisementsTable;

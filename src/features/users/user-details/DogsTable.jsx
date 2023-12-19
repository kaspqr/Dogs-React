import { useEffect, useState } from "react";

import UserDog from "../../dogs/dog-components/UserDog";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const DogsTable = ({ filteredIds, windowWidth, user }) => {
  const [currentDogPage, setCurrentDogPage] = useState(1);
  const [newDogPage, setNewDogPage] = useState("");

  useEffect(() => {
    setCurrentDogPage(1);
    setNewDogPage("");
  }, [user]);

  if (!filteredIds?.length) return;

  const itemsPerDogPage = 5;
  const maxDogPage = Math.ceil(
    filteredIds?.length ? filteredIds?.length / itemsPerDogPage : 1
  );
  const startDogPageIndex = (currentDogPage - 1) * itemsPerDogPage;
  const endDogPageIndex = startDogPageIndex + itemsPerDogPage;

  const goToDogPageButtonDisabled =
    newDogPage < 1 ||
    newDogPage > maxDogPage ||
    parseInt(newDogPage) === currentDogPage;

  const dogsToDisplay = filteredIds?.length
    ? filteredIds.slice(startDogPageIndex, endDogPageIndex)
    : null;

  const tableDogContent = dogsToDisplay?.map((dogId) => (
    <UserDog key={dogId} dogId={dogId} />
  ));

  return (
    <>
      <p>
        <b>
          {filteredIds?.length} Dog{filteredIds?.length === 1 ? null : "s"}{" "}
          Administered
        </b>
      </p>
      <br />
      <p>
        <button
          title="Go to Previous Dogs Page"
          style={currentDogPage === 1 ? { display: "none" } : null}
          disabled={currentDogPage === 1}
          className="pagination-button"
          onClick={() => {
            setCurrentDogPage(currentDogPage - 1);
          }}
        >
          <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
        </button>
        {` Page ${currentDogPage} of ${maxDogPage} `}
        <button
          title="Go to Next Dog Page"
          className="pagination-button"
          style={currentDogPage === maxDogPage ? { display: "none" } : null}
          disabled={currentDogPage === maxDogPage}
          onClick={() => {
            setCurrentDogPage(currentDogPage + 1);
          }}
        >
          <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
        </button>
        {windowWidth > 600 || maxDogPage === 1 ? null : (
          <>
            <br />
            <br />
          </>
        )}
        <span
          className="new-page-input-span"
          style={
            maxDogPage === 1
              ? { display: "none" }
              : windowWidth > 600
              ? null
              : { float: "none" }
          }
        >
          <label htmlFor="new-dog-page-input" className="off-screen">
            Dogs Page Number
          </label>
          <input
            name="new-dog-page-input"
            onChange={(e) => setNewDogPage(e.target.value)}
            value={newDogPage}
            type="number"
            className="new-page-input"
            placeholder="Page no."
          />
          <button
            title="Go to the Specified Dogs Page"
            style={
              goToDogPageButtonDisabled
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
            disabled={goToDogPageButtonDisabled}
            onClick={() => {
              if (newDogPage >= 1 && newDogPage <= maxDogPage) {
                setCurrentDogPage(parseInt(newDogPage));
              }
            }}
            className="black-button"
          >
            Go to Page
          </button>
        </span>
      </p>
      <br />
      {tableDogContent}
      <br />
    </>
  );
};

export default DogsTable;

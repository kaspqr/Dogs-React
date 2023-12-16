import { useState, useEffect } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"

const Pagination = ({
  currentPage,
  setCurrentPage,
  newPage,
  setNewPage,
  maxPage,
  topPosition
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => setWindowWidth(window.innerWidth)

  const goToPageButtonDisabled = newPage < 1 || +newPage > maxPage || +newPage === currentPage
  const previousPageUnavailable = currentPage === 1
  const previousPageButtonStyle = previousPageUnavailable ? { display: "none" } : null

  const labelInput = topPosition
    ? "page-number"
    : "another-page-number"

  return <>
    <p>
      <button
        title="Go to Previous Page"
        style={previousPageButtonStyle}
        disabled={previousPageUnavailable}
        className="pagination-button"
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowLeft} />
      </button>
      {` Page ${currentPage} of ${maxPage} `}
      <button
        title="Go to Next Page"
        className="pagination-button"
        style={currentPage === maxPage
          ? { display: "none" }
          : null
        }
        disabled={currentPage === maxPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faArrowRight} />
      </button>
      {windowWidth > 600 || maxPage === 1
        ? null
        : <>
          <br />
          <br />
        </>
      }
      <span
        className="new-page-input-span"
        style={maxPage === 1
          ? { display: "none" }
          : windowWidth > 600
            ? null
            : { float: "none" }
        }
      >
        <label className="off-screen" htmlFor={labelInput}>
          Page Number
        </label>
        <input
          onChange={(e) => setNewPage(e.target.value)}
          value={newPage}
          type="number"
          name={labelInput}
          className="new-page-input"
          placeholder="Page no."
        />
        <button
          title="Go to the Specified Page"
          style={goToPageButtonDisabled
            ? { backgroundColor: "grey", cursor: "default" }
            : null
          }
          disabled={goToPageButtonDisabled}
          onClick={() => {
            if (newPage >= 1 && newPage <= maxPage) {
              setCurrentPage(+newPage)
            }
          }}
          className="black-button"
        >
          Go to Page
        </button>
      </span>
    </p>
  </>
}

export default Pagination

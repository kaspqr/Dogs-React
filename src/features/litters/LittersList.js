import { useGetLittersQuery } from "./littersApiSlice"
import Litter from "./Litter"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

const LittersList = () => {

  const { userId } = useAuth()

  const [born, setBorn] = useState('')

  const [puppies, setPuppies] = useState()

  const [filteredIds, setFilteredIds] = useState([])

  // GET all the litters
  const {
    data: litters,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetLittersQuery('littersList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const handleBornChanged = date => setBorn(date)

  const handleToggleFilterView = () => {
    const filterDiv = document.getElementById('litter-filter-div')
    if (filterDiv?.style?.display === 'none') {
      filterDiv.style.display = 'block'
    } else {
      filterDiv.style.display = 'none'
    }
  }

  const handleSearchClicked = () => {

    const finalBorn = born !== '' ? new Date(born.getTime()).toDateString() : ''

    const filteredLittersBorn = born?.length
      ? Object.values(litters?.entities)?.filter((litter) => {
        return litter.born === finalBorn
      })
      : Object.values(litters?.entities)
  
    const filteredLittersPuppies = puppies?.length
      ? filteredLittersBorn?.filter((litter) => {
        return litter.children.toString() === puppies
      })
      : filteredLittersBorn

    const finalFilteredLitters = filteredLittersPuppies

    if (!finalFilteredLitters?.length) alert("Unfortunately, no matching litter has been found")

    const filteredIds = finalFilteredLitters?.map((litter) => {
      return litter._id
    })

    setFilteredIds(filteredIds || [])
    
  }

  // Variable for error messages and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = litters

    // Litter component for each litter in the list
    const tableContent = filteredIds?.length
      ? filteredIds.map(litterId => <Litter key={litterId} litterId={litterId} />)
      : ids.map(litterId => <Litter key={litterId} litterId={litterId} />)

    content = (
      <>
        <button
          className="black-button"
          onClick={handleToggleFilterView}
        >
          Toggle Search View
        </button>

        <br />
        <br />

        <div id="litter-filter-div" style={{display: "none"}}>
          <p><b>Born on</b></p>
          <Calendar maxDate={new Date()} onChange={handleBornChanged} value={born} />

          <p><b>Amount of Puppies</b></p>
          <input 
            type="number"
            value={puppies}
            name="litter-puppies-search-input" 
            id="litter-puppies-search-input" 
            onChange={(e) => setPuppies(e.target.value)}
          />

          <br />
          <br />

          <button 
            onClick={handleSearchClicked}
            className="black-button search-button"
          >
            Search <FontAwesomeIcon color="rgb(235, 155, 52)" icon={faMagnifyingGlass} />
          </button>
          <br />
          <br />
        </div>

        {userId?.length ? <Link to={'/litters/new'}><button className="black-button">Add a New Litter</button></Link> : null}

        <br />
        <br />

        <table className="content-table">
          <thead>
            <tr>
              <th>Link</th>
              <th>Mother's Name</th>
              <th>Born</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
      </>
    )
  }

  return content
}

export default LittersList

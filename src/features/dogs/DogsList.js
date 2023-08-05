import { useGetDogsQuery } from "./dogsApiSlice"
import Dog from "./Dog"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { Countries } from "../../config/countries"
import { bigCountries } from "../../config/bigCountries"
import { Regions } from "../../config/regions"
import { Breeds } from "../../config/breeds"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const DogsList = () => {

  const { userId } = useAuth()

  const [name, setName] = useState('')

  const [country, setCountry] = useState('')

  const [region, setRegion] = useState('')

  const [breed, setBreed] = useState('')

  const [chipnumber, setChipnumber] = useState('')

  const [gender, setGender] = useState('')

  const [heat, setHeat] = useState('')

  const [chipped, setChipped] = useState('')

  const [passport, setPassport] = useState('')

  const [fixed, setFixed] = useState('')

  const [filteredIds, setFilteredIds] = useState([])

  const breeds = [ ...Object.values(Breeds) ]
  const breedOptions = breeds.map(breed => (
      <option key={breed} value={breed}>{breed}</option>
  ))

  // GET all the dogs
  const {
    data: dogs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogsQuery('dogsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const handleCountryChanged = (e) => {
    setRegion('')
    setCountry(e.target.value)
  }

  const handleChippedChanged = (e) => {
    if (e.target.value !== 'Yes') {
      setChipnumber('')
    }

    setChipped(e.target.value)
  }

  const handleGenderChanged = (e) => {
    if (e.target.value !== 'female') {
      setHeat('')
    }

    setGender(e.target.value)
  }

  const handleToggleFilterView = () => {
    const filterDiv = document.getElementById('dog-filter-div')
    if (filterDiv?.style?.display === 'none') {
      filterDiv.style.display = 'block'
    } else {
      filterDiv.style.display = 'none'
    }
  }

  const handleSearchClicked = () => {
  
    const filteredDogsName = Object.values(dogs?.entities)?.filter((dog) => {
      return dog.name?.includes(name)
    })
  
    const filteredDogsChipnumber = chipnumber?.length
      ? filteredDogsName?.filter((dog) => {
        return dog.chipnumber === chipnumber
      })
      : filteredDogsName
  
    const filteredDogsRegion = region?.length
      ? filteredDogsChipnumber?.filter((dog) => {
        return dog.region === region
      })
      : filteredDogsChipnumber
  
    const filteredDogsCountry = country?.length
      ? filteredDogsRegion?.filter((dog) => {
        return dog.country === country
      })
      : filteredDogsRegion
  
    const filteredDogsBreed = breed?.length
      ? filteredDogsCountry?.filter((dog) => {
        return dog.breed === breed
      })
      : filteredDogsCountry
  
    const filteredDogsGender = gender?.length
      ? filteredDogsBreed?.filter((dog) => {
        if (gender === 'female') {
          return dog.female === true
        } else {
          return dog.female === false
        }
      })
      : filteredDogsBreed
  
    const filteredDogsChipped = chipped?.length
      ? filteredDogsGender?.filter((dog) => {
        if (chipped === 'yes') {
          return dog.microchipped === true
        } else {
          return dog.microchipped === false
        }
      })
      : filteredDogsGender
  
    const filteredDogsPassport = passport?.length
      ? filteredDogsChipped?.filter((dog) => {
        if (passport === 'yes') {
          return dog.passport === true
        } else {
          return dog.passport === false
        }
      })
      : filteredDogsChipped
  
    const filteredDogsFixed = fixed?.length
      ? filteredDogsPassport?.filter((dog) => {
        if (fixed === 'yes') {
          return dog.sterilized === true
        } else {
          return dog.sterilized === false
        }
      })
      : filteredDogsPassport
  
    const filteredDogsHeat = heat?.length
      ? filteredDogsFixed?.filter((dog) => {
        if (heat === 'yes') {
          return dog.heat === true
        } else {
          return dog.heat === false
        }
      })
      : filteredDogsFixed

    const finalFilteredDogs = filteredDogsHeat

    if (!finalFilteredDogs?.length) alert("Unfortunately, no matching dog has been found")

    const filteredIds = finalFilteredDogs?.map((dog) => {
      return dog._id
    })

    setFilteredIds(filteredIds || [])

    console.log(filteredIds)
    
  }

  // Variable for errors and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = dogs

    // Dog component for each dog
    const tableContent = filteredIds?.length
      ? filteredIds.map(dogId => <Dog key={dogId} dogId={dogId} />).reverse()
      : ids?.map(dogId => <Dog key={dogId} dogId={dogId} />).reverse()

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

        <div id="dog-filter-div" style={{display: "none"}}>
          <p><b>Name</b></p>
          <input 
            value={name}
            name="dog-name-search-input" 
            id="dog-name-search-input" 
            onChange={(e) => setName(e.target.value)}
          />

          <p><b>Breed</b></p>
          <select 
            onChange={(e) => setBreed(e.target.value)}
            value={breed}
            name="dogs-filter-breed-select" 
            id="dogs-filter-breed-select"
          >
            <option value="">--</option>
            {breedOptions}
          </select>

          <p><b>Country</b></p>
          <select 
            value={country}
            name="dog-country" 
            id="dog-country"
            onChange={handleCountryChanged}
          >
            <option value="">--</option>
            {Countries}
          </select>
          
          <p><b>Region</b></p>
          <select 
            value={region}
            name="dog-region" 
            id="dog-region"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">--</option>
            {bigCountries?.includes(country)
              ? Regions[country]
              : null
            }
          </select>

          <p><b>Passport</b></p>
          <select 
            value={passport} 
            onChange={(e) => setPassport(e.target.value)}
            name="passport" 
            id="passport"
          >
            <option value="">--</option>
            <option value="yes">Documented</option>
            <option value="no">Not Documented</option>
          </select>

          <p><b>Fixed</b></p>
          <select 
            value={fixed} 
            onChange={(e) => setFixed(e.target.value)}
            name="fixed" 
            id="fixed"
          >
            <option value="">--</option>
            <option value="yes">Fixed</option>
            <option value="no">Not Fixed</option>
          </select>

          <p><b>Good</b></p>
          <select 
            value={gender} 
            onChange={handleGenderChanged}
            name="gender" 
            id="gender"
          >
            <option value="">--</option>
            <option value="female">Girl</option>
            <option value="male">Boy</option>
          </select>

          <p><b>Currently in Heat</b></p>
          <select 
            disabled={gender !== 'female'}
            value={heat} 
            onChange={(e) => setHeat(e.target.value)}
            name="heat" 
            id="heat"
          >
            <option value="">--</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <p><b>Chipped</b></p>
          <select 
            value={chipped} 
            onChange={handleChippedChanged}
            name="chipped" 
            id="chipped"
          >
            <option value="">--</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <p><b>Chipnumber</b></p>
          <input 
            disabled={chipped !== 'yes'}
            value={chipnumber} 
            onChange={(e) => setChipnumber(e.target.value)}
            name="chipnumber" 
            id="chipnumber"
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

        {userId?.length ? (<Link to={'/dogs/new'}><button className="black-button">Add a New Dog</button></Link>) : null}

        <br />
        <br />
        
        <table className="content-table">
          <thead>
            <tr>
              <th className="first-th">Name</th>
              <th>Breed</th>
              <th>Good</th>
              <th>Born</th>
              <th className="last-th">Administered by</th>
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

export default DogsList

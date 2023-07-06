import { useGetDogsQuery } from "./dogsApiSlice"
import Dog from "./Dog"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const DogsList = () => {

  const { userId } = useAuth()

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

  // Variable for errors and content
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = dogs

    // Dog component for each dog
    const tableContent = ids?.length
      ? ids.map(dogId => <Dog key={dogId} dogId={dogId} />)
      : null

    content = (
      <>
        {userId?.length ? (<Link className="list-add-new-title" to={'/dogs/new'}><button className="black-button">Add a New Dog</button></Link>) : null}
        <table className="content-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Breed</th>
              <th>Good</th>
              <th>Born</th>
              <th>Administered by</th>
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

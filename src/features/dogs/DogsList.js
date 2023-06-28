import { useGetDogsQuery } from "./dogsApiSlice"
import Dog from "./Dog"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const DogsList = () => {

  const { userId } = useAuth()

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

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = dogs

    const tableContent = ids?.length
      ? ids.map(dogId => <Dog key={dogId} dogId={dogId} />)
      : null

    content = (
      <>
        {userId?.length ? (<Link className="list-add-new-title" to={'/dogs/new'}><button>Add a New Dog</button></Link>) : null}
        <table className="content-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Dog ID</th>
              <th>Administrative user</th>
              <th>Breed</th>
              <th>Gender</th>
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

export default DogsList

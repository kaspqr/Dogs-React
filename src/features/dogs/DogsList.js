import { useGetDogsQuery } from "./dogsApiSlice"
import Dog from "./Dog"

const DogsList = () => {

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogsQuery()

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = notes

    const tableContent = ids?.length
      ? ids.map(dogId => <Dog key={dogId} dogId={dogId} />)
      : null

    content = (
      <table>
        <thead>
          <tr>
            <th>Administrative user</th>
            <th>Owner</th>
            <th>Name</th>
            <th>Breed</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content
}

export default DogsList

import { useGetLittersQuery } from "./littersApiSlice"
import Litter from "./Litter"

const LittersList = () => {

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

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = litters

    const tableContent = ids?.length
      ? ids.map(litterId => <Litter key={litterId} litterId={litterId} />)
      : null

    content = (
      <table>
        <thead>
          <tr>
            <th>Litter ID</th>
            <th>Mother's Name</th>
            <th>Mother ID</th>
            <th>Born</th>
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

export default LittersList

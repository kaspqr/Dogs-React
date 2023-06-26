import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import Advertisement from "./Advertisement"

const AdvertisementsList = () => {

  const {
    data: advertisements,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementsQuery('advertisementsList', {
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
    const { ids } = advertisements

    const tableContent = ids?.length
      ? ids.map(advertisementId => <Advertisement key={advertisementId} advertisementId={advertisementId} />)
      : null

    content = (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>ID</th>
            <th>Poster</th>
            <th>Type</th>
            <th>Price</th>
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

export default AdvertisementsList

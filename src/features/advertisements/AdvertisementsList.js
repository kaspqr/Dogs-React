import { useGetAdvertisementsQuery } from "./advertisementsApiSlice"
import Advertisement from "./Advertisement"
import useAuth from "../../hooks/useAuth"
import { Link } from "react-router-dom"

const AdvertisementsList = () => {

  const { userId } = useAuth()

  // GET all the advertisements
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

  // Variable for displaying either an error or the content if the fetch was sucessful
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = advertisements

    // Advertisement component for each advertisement
    const tableContent = ids?.length
      ? ids.map(advertisementId => <Advertisement key={advertisementId} advertisementId={advertisementId} />)
      : null

    content = (
      <>
        {userId?.length ? <Link className="list-add-new-title" to={'/advertisements/new'}><button className="black-button">Post an Advertisement</button></Link> : null}
        <table id="advertisement-table" className="content-table">
          <thead>
            <tr>
              <th className="table-4-columns">Title</th>
              <th className="table-4-columns">Poster</th>
              <th className="table-4-columns">Type</th>
              <th className="table-4-columns">Price</th>
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

export default AdvertisementsList

import { useGetDogReportsQuery } from "../dogreports/dogReportsApiSlice"
import DogReport from "./DogReport"

const DogReportsList = () => {

  // GET all the dog reports
  const {
    data: dogReports,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogReportsQuery('dogReportsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // Variable for displaying either an error or the content if the fetch was successful
  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
    const { ids } = dogReports

    // Dog report component for each report
    const tableContent = ids?.length
      ? ids.map(dogReportId => <DogReport key={dogReportId} dogReportId={dogReportId} />)
      : null

    content = (
      <>
        <table id="dog-report-table" className="content-table">
          <thead>
            <tr>
              <th className="first-th">Dog Report</th>
              <th>Reporter</th>
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

export default DogReportsList

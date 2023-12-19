import { useEffect } from "react";
import Swal from "sweetalert2";

import { useGetDogReportsQuery } from "../../dogreports/dogReportsApiSlice";
import DogReport from "./DogReport";
import { alerts } from "../../../components/alerts";

const DogReportsList = () => {
  const {
    data: dogReports,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDogReportsQuery("dogReportsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Fetching Dog Reports", "Loading...");
    else Swal.close();
  }, [isLoading]);

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Dog Reports");

  if (isSuccess) {
    const { ids } = dogReports;

    const tableContent = ids?.length
      ? ids.map((dogReportId) => (
          <DogReport key={dogReportId} dogReportId={dogReportId} />
        ))
      : null;

    const content = ids?.length ? (
      tableContent
    ) : (
      <p>There are no dog reports</p>
    );

    return content;
  }

  return;
};

export default DogReportsList;

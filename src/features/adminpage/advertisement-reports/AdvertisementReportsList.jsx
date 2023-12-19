import { useEffect } from "react";
import Swal from "sweetalert2";

import { useGetAdvertisementReportsQuery } from "../../advertisementreports/advertisementReportsApiSlice";
import AdvertisementReport from "./AdvertisementReport";
import { alerts } from "../../../components/alerts";

const AdvertisementReportsList = () => {
  const {
    data: advertisementReports,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAdvertisementReportsQuery("advertisementReportsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading)
      alerts.loadingAlert("Fetching Advertisement Reports", "Loading...");
    else Swal.close();
  }, [isLoading]);

  if (isError)
    alerts.errorAlert(
      `${error?.data?.message}`,
      "Error Fetching Advertisement Reports"
    );

  if (isSuccess) {
    const { ids } = advertisementReports;

    const tableContent = ids?.length
      ? ids.map((advertisementReportId) => {
          return (
            <AdvertisementReport
              key={advertisementReportId}
              advertisementReportId={advertisementReportId}
            />
          );
        })
      : null;

    const content = ids?.length ? (
      tableContent
    ) : (
      <p>There are no advertisement reports</p>
    );

    return content;
  }

  return;
};

export default AdvertisementReportsList;

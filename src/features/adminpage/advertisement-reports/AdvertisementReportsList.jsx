import { useEffect } from "react";

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
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  if (isLoading) return

  if (isSuccess) {
    const { ids } = advertisementReports;

    if (!ids?.length) return <p>There are no advertisement reports</p>

    return (
      <>
        {ids.map((id) => <AdvertisementReport key={id} advertisementReportId={id} />)}
      </>
    )
  }

  return
}

export default AdvertisementReportsList;

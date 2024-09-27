import { useEffect } from "react";

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
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  if (isLoading) return

  if (isSuccess) {
    const { ids } = dogReports;

    if (!ids?.length) return <p>There are no dog reports</p>

    return (
      <>
        {ids.map((id) => <DogReport key={id} dogReportId={id} />)}
      </>
    )
  }

  return;
};

export default DogReportsList;

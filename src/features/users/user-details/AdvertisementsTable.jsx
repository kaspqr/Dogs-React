import { useEffect } from "react";

import UserAdvertisement from "../../advertisements/components/UserAdvertisement";
import { useGetUserAdvertisementsQuery } from "../../advertisements/advertisement-slices/advertisementsApiSlice";
import { alerts } from "../../../components/alerts";

const AdvertisementsTable = ({ user }) => {

  const {
    data: advertisements,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserAdvertisementsQuery({ id: user?.id }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    const { ids } = advertisements;

    if (!ids.length) return;

    return (
      <>
        <br />
        <br />
        <p>
          <b>
            {ids?.length} Active Advertisement
            {ids?.length !== 1 && "s"}
          </b>
        </p>
        <br /> 
        {ids?.map((advertisementId) => (
          <UserAdvertisement key={advertisementId} advertisementId={advertisementId} />
        ))}
        <br />
      </>
    );
  }

  return;
};

export default AdvertisementsTable;

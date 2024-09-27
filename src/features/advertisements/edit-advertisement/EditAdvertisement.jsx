import { useParams } from "react-router-dom";

import EditAdvertisementForm from "./EditAdvertisementForm";
import { useGetAdvertisementByIdQuery } from "../advertisement-slices/advertisementsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { alerts } from "../../../components/alerts";

const EditAdvertisement = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const {
    data: advertisement,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementByIdQuery({ id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    if (!advertisement) return

    if (advertisement?.poster !== userId)
      return <p>This is not your advertisement</p>;

    return <EditAdvertisementForm advertisement={advertisement} />;
  }
};

export default EditAdvertisement;

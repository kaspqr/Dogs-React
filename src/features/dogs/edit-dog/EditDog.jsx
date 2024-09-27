import { useParams } from "react-router-dom";

import EditDogForm from "./EditDogForm";
import { useGetDogByIdQuery } from "../dog-slices/dogsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { alerts } from "../../../components/alerts";

const EditDog = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const {
    data: dog,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    if (!dog) return

    if (dog?.user !== userId) return <p>This is not your dog</p>;

    return <EditDogForm dog={dog} />;
  }

  return
};

export default EditDog;

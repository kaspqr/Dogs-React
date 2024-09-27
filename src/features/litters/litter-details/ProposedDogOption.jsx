import { useEffect } from "react";
import { useGetDogByIdQuery } from "../../dogs/dog-slices/dogsApiSlice";
import { alerts } from "../../../components/alerts";

const ProposedDogOption = ({ dogId }) => {
  const {
    data: dog,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id: dogId }, {
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

    return (
      <option value={dog?.id} key={dog?.id}>
        {dog?.name}
      </option>
    )
  }

  return
}

export default ProposedDogOption

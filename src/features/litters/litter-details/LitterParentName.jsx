import React, { useEffect } from 'react'
import { useGetDogByIdQuery } from '../../dogs/dog-slices/dogsApiSlice'
import { alerts } from '../../../components/alerts';

const LitterParentName = ({ parentId }) => {
  const {
    data: dog,
    isLoading: isLoading,
    isSuccess: isSuccess,
    isError: isError,
    error: error
  } = useGetDogByIdQuery({ id: parentId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}aaa`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    return (
      <>
        {dog?.name}
      </>
    )
  }

  return
}

export default LitterParentName

import React, { useEffect } from 'react'
import { useGetDogByIdQuery } from '../dog-slices/dogsApiSlice';
import { alerts } from '../../../components/alerts';
import { Link } from 'react-router-dom';

const LitterParent = ({ parentId, litterParent }) => {
  const {
    data: parent,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id: parentId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`, `${litterParent} ${parentId}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) return (
    <p>
      <b>
        {litterParent}{" "}
        <Link className="orange-link" to={`/dogs/${parent?.id}`}>
          {parent?.name}
        </Link>
      </b>
    </p>
  )

  return
}

export default LitterParent

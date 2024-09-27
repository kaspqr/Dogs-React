import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGetUserByIdQuery } from '../user-slices/usersApiSlice';
import { alerts } from '../../../components/alerts';

const DogUserInfo = ({ userId }) => {
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !user) return

  if (isSuccess) {
    return (
      <Link className="orange-link" to={`/users/${user?.id}`}>
        <b>{user?.username}</b>
      </Link>
    )
  }

  return
}

export default DogUserInfo

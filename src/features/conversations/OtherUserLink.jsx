import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { alerts } from '../../components/alerts';
import { useGetUserByIdQuery } from '../users/user-slices/usersApiSlice';

const OtherUserLink = ({ id }) => {
  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess && user) {
    return (
      <Link className="grey-link" to={`/users/${user?.id}`}>
        {user?.username}
      </Link>
    )
  }

  return
}

export default OtherUserLink

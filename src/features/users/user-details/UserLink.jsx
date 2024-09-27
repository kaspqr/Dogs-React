import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGetUserByIdQuery } from '../user-slices/usersApiSlice';
import { alerts } from '../../../components/alerts';

const UserLink = ({ userId }) => {
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

  if (isLoading) return

  if (isSuccess) {
    return (
      <Link className="orange-link" to={`/users/${user?.id}`}>
        {user?.username}
      </Link>
    )
  }

  return
}

export default UserLink

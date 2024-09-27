import { useEffect } from 'react'
import DogIcon from "../../../config/images/DogIcon.jpg"
import { alerts } from '../../../components/alerts';
import { useGetDogByIdQuery } from '../../dogs/dog-slices/dogsApiSlice';
import { Link } from 'react-router-dom';

const LitterPageParent = ({ parentId, litterParent }) => {
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
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading || !parent) return

  if (isSuccess) {
    return (
      <>
        <div className={`litter-${litterParent?.toLowerCase()}-div`}>
          <img
            width="150px"
            height="150px"
            className="dog-profile-picture"
            src={parent?.image?.length && parent?.image !== "none " ? parent?.image : DogIcon}
            alt={litterParent}
          />
          <br />
          <span className={`litter-${litterParent?.toLowerCase()}-span`}>
            {litterParent}
            <br />
            <Link className="orange-link" to={`/dogs/${parent.id}`}>
              <b>{parent?.name}</b>
            </Link>
            <br />
          </span>
        </div>
      </>
    )
  }

  return
}

export default LitterPageParent

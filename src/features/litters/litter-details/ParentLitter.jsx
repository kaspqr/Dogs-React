import { useEffect } from 'react'
import { alerts } from '../../../components/alerts';
import { Link } from 'react-router-dom';
import { useGetLitterByIdQuery } from '../litter-slices/littersApiSlice';
import LitterParent from '../../dogs/dog-details/LitterParent';

const ParentLitter = ({ dog }) => {
  const {
    data: parentLitter,
    isLoading: isLitterLoading,
    isSuccess: isLitterSuccess,
    isError: isLitterError,
    error: litterError
  } = useGetLitterByIdQuery({ id: dog?.litter }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLitterError) alerts.errorAlert(`${litterError?.data?.message}`)
  }, [isLitterError])

  if (isLitterLoading || !parentLitter) return

  if (isLitterSuccess) {
    return <>
      <p>
        <b>
          Parents of {dog?.name}'s{" "}
          <Link className="orange-link" to={`/litters/${dog?.litter}`}>
            <b>Litter</b>
          </Link>
        </b>
      </p>
      <LitterParent parentId={parentLitter?.mother} litterParent={"Mother"} />
      <LitterParent parentId={parentLitter?.father} litterParent={"Father"} />
    </>
  }

  return
}

export default ParentLitter

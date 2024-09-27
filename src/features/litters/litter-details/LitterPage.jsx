import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetLitterByIdQuery } from "../litter-slices/littersApiSlice";
import { useGetLitterPuppiesQuery } from "../../dogs/dog-slices/dogsApiSlice";
import useAuth from "../../../hooks/useAuth";
import Dog from "../../dogs/dog-components/Dog";
import DogIcon from "../../../config/images/DogIcon.jpg";
import { alerts } from "../../../components/alerts";
import ProposePuppy from "./ProposePuppy";
import DeleteLitter from "./DeleteLitter";
import ProposeFather from "./ProposeFather";
import AddPuppy from "./AddPuppy";
import RemoveFather from "./RemoveFather";
import AddFather from "./AddFather";
import LitterPageParent from "./LitterPageParent";

const LitterPage = () => {
  const { userId } = useAuth();
  const { litterid } = useParams();

  const {
    data: litter,
    isLoading: isLoading,
    isSuccess: isSuccess,
    isError: isError,
    error: error,
    refetch
  } = useGetLitterByIdQuery({ id: litterid }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: puppies,
    isLoading: isPuppiesLoading,
    isSuccess: isPuppiesSuccess,
    isError: isPuppiesError,
    error: puppiesError,
    refetch: refetchLitterPuppies
  } = useGetLitterPuppiesQuery({ id: litterid }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isPuppiesError) alerts.errorAlert(`${puppiesError?.data?.message}`);
  }, [isPuppiesError])

  if (!litter || isLoading || isPuppiesLoading) return;

  if (isSuccess && isPuppiesSuccess) {
    const { ids } = puppies

    return (
      <>
        <div className="litter-parents-div">
          <LitterPageParent parentId={litter?.mother} litterParent={"Mother"} />
          {litter?.father
            ? <LitterPageParent parentId={litter?.father} litterParent={"Father"} />
            : <div className="litter-father-div">
              <img
                width="150px"
                height="150px"
                className="dog-profile-picture"
                src={DogIcon}
                alt="Father"
              />
              <br />
              <span className="litter-father-span">
                Father
                <br />
                Not Added
                <br />
              </span>
            </div>
          }
        </div>
        <p>
          <b>Puppies' Breed </b>
          {litter?.breed}
        </p>
        <p>
          <b>Born </b>
          {litter?.born?.split(" ").slice(1, 4).join(" ")}
        </p>
        <p>
          <b>In </b>
          {litter?.region?.length && litter?.region !== "none " && `${litter?.region}, `}
          {litter?.country}
        </p>
        <p>
          <b>
            {litter?.children} {litter?.children === 1 ? "Puppy" : "Puppies"}
          </b>
        </p>
        <br />
        {(litter?.father && userId?.length) && 
          <RemoveFather
            litterMotherId={litter?.mother}
            litterFatherId={litter?.father}
            litterId={litterid}
            userId={userId}
            refetch={refetch}
          />
        }
        {(!litter?.father && userId?.length) && <>
          <ProposeFather userId={userId} litter={litter} refetchLitter={refetch} />
          <AddFather litter={litter} userId={userId} refetch={refetch} />
        </>}
        {(userId?.length && litter?.children > ids?.length) && <>
          <ProposePuppy userId={userId} litter={litter} refetchPuppies={refetchLitterPuppies} />
          <AddPuppy userId={userId} litter={litter} refetch={refetch} />
        </>}
        {ids?.length ? (
          <>
            <p>
              <b>Puppies</b>
            </p>
            <br />
            {ids.map((id) => <Dog key={id} dogId={id} />)}
          </>
        ) : (
          <p>No puppies have been added to this litter yet</p>
        )}
        {userId?.length && <DeleteLitter litter={litter} userId={userId} />}
      </>
    );
  }

  return;
};

export default LitterPage;

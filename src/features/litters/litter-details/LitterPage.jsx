import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetLittersQuery } from "../litter-slices/littersApiSlice";
import { useGetPuppyProposesQuery } from "../litter-slices/puppyProposesApiSlice";
import { useGetDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";
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
import { useGetFatherProposesQuery } from "../litter-slices/fatherProposesApiSlice";
import { useEffect } from "react";

const LitterPage = () => {
  const { userId } = useAuth();
  const { litterid } = useParams();

  const {
    data: dogs,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDogsQuery("dogsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: puppyProposes,
    isLoading: isAllPuppyProposesLoading,
    isSuccess: isAllPuppyProposesSuccess,
    isError: isAllPuppyProposesError,
    error: allPuppyProposesError,
  } = useGetPuppyProposesQuery("puppyProposesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: fatherProposes,
    isLoading: isAllFatherProposesLoading,
    isSuccess: isAllFatherProposesSuccess,
    isError: isAllFatherProposesError,
    error: allFatherProposesError,
  } = useGetFatherProposesQuery("fatherProposesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { litter } = useGetLittersQuery("littersList", {
    selectFromResult: ({ data }) => ({
      litter: data?.entities[litterid],
    }),
  });

  const { mother } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      mother: data?.entities[litter?.mother?.toString()],
    }),
  });

  const { father } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      father: data?.entities[litter?.father?.toString()],
    }),
  });

  useEffect(() => {
    if (isLoading || isAllPuppyProposesLoading || isAllFatherProposesLoading)
      alerts.loadingAlert("Updating data", "Loading...");
    else Swal.close();
  }, [isLoading, isAllPuppyProposesLoading, isAllFatherProposesLoading]);

  if (!litter || !mother) return;
  if (isError) alerts.errorAlert(`${error?.data?.message}`, "Error");
  if (isAllPuppyProposesError)
    alerts.errorAlert(`${allPuppyProposesError?.data?.message}`, "Error");
  if (isAllFatherProposesError)
    alerts.errorAlert(`${allFatherProposesError?.data?.message}`, "Error");

  if (isSuccess && isAllPuppyProposesSuccess && isAllFatherProposesSuccess) {
    const { ids, entities } = dogs;
    const { ids: puppyProposalIds, entities: puppyProposalEntities } =
      puppyProposes;
    const { ids: fatherProposalIds, entities: fatherProposalEntities } =
      fatherProposes;

    const currentLitterDogsIds = ids.filter(
      (dogId) => entities[dogId].litter === litter?.id
    );

    const filteredPuppyProposalIds = puppyProposalIds.filter(
      (puppyProposalId) =>
        puppyProposalEntities[puppyProposalId].litter === litter?.id
    );
    const filteredFatherProposalIds = fatherProposalIds.filter(
      (fatherProposalId) =>
        fatherProposalEntities[fatherProposalId].litter === litter?.id
    );
    const filteredPuppyProposals = filteredPuppyProposalIds.map(
      (proposalId) => puppyProposalEntities[proposalId].puppy
    );
    const filteredFatherProposals = filteredFatherProposalIds?.map(
      (proposalId) => fatherProposalEntities[proposalId].father
    );

    const motherImg =
      mother?.image?.length && mother?.image !== "none "
        ? mother?.image
        : DogIcon;
    const fatherImg =
      father?.image?.length && father?.image !== "none "
        ? father.image
        : DogIcon;

    return (
      <>
        <div className="litter-parents-div">
          <div className="litter-mother-div">
            <img
              width="150px"
              height="150px"
              className="dog-profile-picture"
              src={motherImg}
              alt="Mother"
            />
            <br />
            <span className="litter-mother-span">
              Mother
              <br />
              <Link className="orange-link" to={`/dogs/${mother.id}`}>
                <b>{mother?.name}</b>
              </Link>
              <br />
            </span>
          </div>
          <div className="litter-father-div">
            <img
              width="150px"
              height="150px"
              className="dog-profile-picture"
              src={fatherImg}
              alt="Father"
            />
            <br />
            <span className="litter-father-span">
              Father
              <br />
              {father?.id?.length ? (
                <Link className="orange-link" to={`/dogs/${father?.id}`}>
                  <b>{father?.name}</b>
                </Link>
              ) : (
                "Not Added"
              )}
              <br />
            </span>
          </div>
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
          {litter?.region?.length &&
            litter?.region !== "none " &&
            `${litter?.region}, `}
          {litter?.country}
        </p>
        <p>
          <b>
            {litter?.children} {litter?.children === 1 ? "Puppy" : "Puppies"}
          </b>
        </p>
        <br />
        <RemoveFather
          litterId={litterid}
          father={father}
          mother={mother}
          userId={userId}
        />
        <ProposeFather
          father={father}
          filteredFatherProposals={filteredFatherProposals}
          entities={entities}
          ids={ids}
          isLoading={isLoading}
          userId={userId}
          mother={mother}
          litterId={litterid}
          litter={litter}
          currentLitterDogsIds={currentLitterDogsIds}
          filteredPuppyProposals={filteredPuppyProposals}
        />
        <AddFather
          father={father}
          fatherProposals={filteredFatherProposals}
          entities={entities}
          litterId={litterid}
        />
        <ProposePuppy
          entities={entities}
          userId={userId}
          mother={mother}
          litterId={litterid}
          currentLitterDogsIds={currentLitterDogsIds}
          ids={ids}
          father={father}
          filteredPuppyProposals={filteredPuppyProposals}
          filteredFatherProposals={filteredFatherProposals}
          litter={litter}
        />
        <AddPuppy
          proposedPuppies={filteredPuppyProposals}
          entities={entities}
          litterId={litterid}
          userId={userId}
          mother={mother}
          litter={litter}
          currentLitterDogsIds={currentLitterDogsIds}
        />
        {currentLitterDogsIds?.length ? (
          <>
            <p>
              <b>Puppies</b>
            </p>
            <br />
            {currentLitterDogsIds
              .map((dogId) => entities[dogId])
              .map((dog) => (
                <Dog key={dog.id} dogId={dog.id} />
              ))}
          </>
        ) : (
          <p>No puppies have been added to this litter yet</p>
        )}
        {mother?.user === userId && <DeleteLitter litterId={litterid} />}
      </>
    );
  }

  return;
};

export default LitterPage;

import React from "react";
import { useDeleteDogProposeMutation } from "../../dogs/dog-slices/proposeDogApiSlice";
import {
  useDeleteFatherProposeMutation,
  useGetFatherProposesQuery,
} from "../../litters/litter-slices/fatherProposesApiSlice";
import {
  useDeletePuppyProposeMutation,
  useGetPuppyProposesQuery,
} from "../../litters/litter-slices/puppyProposesApiSlice";
import { alerts } from "../../../components/alerts";

const DeleteProposals = ({
  user,
  userId,
  proposeIds,
  filteredIds,
  proposeEntities,
}) => {
  const {
    data: fatherproposes,
    isSuccess: isFatherProposeSuccess,
    isError: isFatherProposeError,
    error: fatherProposeError,
  } = useGetFatherProposesQuery("fatherProposesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: puppyproposes,
    isSuccess: isPuppyProposeSuccess,
    isError: isPuppyProposeError,
    error: puppyProposeError,
  } = useGetPuppyProposesQuery("puppyProposesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [
    deleteDogPropose,
    { isError: isErrorDeleteDogPropose, error: errorDeleteDogPropose },
  ] = useDeleteDogProposeMutation();

  const [
    deleteFatherPropose,
    { isError: isErrorDeleteFatherPropose, error: errorDeleteFatherPropose },
  ] = useDeleteFatherProposeMutation();

  const [
    deletePuppyPropose,
    { isError: isErrorDeletePuppyPropose, error: errorDeletePuppyPropose },
  ] = useDeletePuppyProposeMutation();

  if (isErrorDeleteDogPropose)
    alerts.errorAlert(
      `${errorDeleteDogPropose?.data?.message}`,
      "Error Deleting Proposals"
    );
  if (isErrorDeleteFatherPropose)
    alerts.errorAlert(
      `${errorDeleteFatherPropose?.data?.message}`,
      "Error Deleting Proposals"
    );
  if (isErrorDeletePuppyPropose)
    alerts.errorAlert(
      `${errorDeletePuppyPropose?.data?.message}`,
      "Error Deleting Proposals"
    );
  if (isFatherProposeError)
    alerts.errorAlert(
      `${fatherProposeError?.data?.message}`,
      "Error Fetching Proposals"
    );
  if (isPuppyProposeError)
    alerts.errorAlert(
      `${puppyProposeError?.data?.message}`,
      "Error Fetching Proposals"
    );

  const handleDeleteDogProposal = async (proposal) => {
    await deleteDogPropose({ id: proposal });
  };

  const handleDeleteFatherProposal = async (proposal) => {
    await deleteFatherPropose({ id: proposal });
  };

  const handleDeletePuppyProposal = async (proposal) => {
    await deletePuppyPropose({ id: proposal });
  };

  if (isFatherProposeSuccess && isPuppyProposeSuccess) {
    const { ids: fatherProposeIds, entities: fatherProposeEntities } =
      fatherproposes;
    const { ids: puppyProposeIds, entities: puppyProposeEntities } =
      puppyproposes;

    const filteredMadeDogProposes =
      user?.id === userId
        ? proposeIds?.filter((proposeId) =>
            filteredIds?.includes(proposeEntities[proposeId]?.dog)
          )
        : null;

    const filteredMadeFatherProposes =
      user?.id === userId
        ? fatherProposeIds?.filter((proposeId) =>
            filteredIds?.includes(fatherProposeEntities[proposeId]?.father)
          )
        : null;

    const filteredMadePuppyProposes =
      user?.id === userId
        ? puppyProposeIds?.filter((proposeId) =>
            filteredIds?.includes(puppyProposeEntities[proposeId]?.puppy)
          )
        : null;

    return (
      <>
        {filteredMadeDogProposes?.length > 0 && (
          <>
            <button
              title="Delete Dog Transfer Proposals Made by Me"
              className="black-button three-hundred"
              onClick={() =>
                filteredMadeDogProposes?.forEach((proposal) => {
                  handleDeleteDogProposal(proposal);
                })
              }
            >
              Delete Dog Proposals Made by Me
            </button>
            <br />
            <br />
          </>
        )}
        {filteredMadeFatherProposes?.length > 0 && (
          <>
            <button
              title="Delete Father Proposals Made by Me"
              className="black-button three-hundred"
              onClick={() =>
                filteredMadeFatherProposes?.forEach((proposal) => {
                  handleDeleteFatherProposal(proposal);
                })
              }
            >
              Delete Father Proposals Made by Me
            </button>
            <br />
            <br />
          </>
        )}
        {filteredMadePuppyProposes?.length > 0 && (
          <>
            <button
              title="Delete Puppy Proposals Made by Me"
              className="black-button three-hundred"
              onClick={() =>
                filteredMadePuppyProposes?.forEach((proposal) => {
                  handleDeletePuppyProposal(proposal);
                })
              }
            >
              Delete Puppy Proposals Made by Me
            </button>
            <br />
            <br />
          </>
        )}
      </>
    );
  }

  return;
};

export default DeleteProposals;

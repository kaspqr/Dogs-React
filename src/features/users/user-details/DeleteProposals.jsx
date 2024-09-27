import { useEffect } from "react";

import { useDeleteDogProposeMutation, useGetDogProposesQuery } from "../../dogs/dog-slices/proposeDogApiSlice";
import { useDeleteFatherProposeMutation, useGetFatherProposesQuery } from "../../litters/litter-slices/fatherProposesApiSlice";
import { useDeletePuppyProposeMutation, useGetUserPuppyProposesQuery } from "../../litters/litter-slices/puppyProposesApiSlice";
import { alerts } from "../../../components/alerts";

const DeleteProposals = ({ userId }) => {
  const {
    data: dogproposes,
    isLoading: isDogProposesLoading,
    isSuccess: isDogProposesSuccess,
    isError: isDogProposesError,
    error: dogProposesError,
  } = useGetDogProposesQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false
  });

  const {
    data: fatherproposes,
    isLoading: isFatherProposesLoading,
    isSuccess: isFatherProposesSuccess,
    isError: isFatherProposesError,
    error: fatherProposesError,
  } = useGetFatherProposesQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false
  });

  const {
    data: puppyproposes,
    isLoading: isPuppyProposesLoading,
    isSuccess: isPuppyProposesSuccess,
    isError: isPuppyProposesError,
    error: puppyProposesError,
  } = useGetUserPuppyProposesQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false
  });

  const [deleteDogPropose, {
    isLoading: isDeleteDogProposeLoading,
    isError: isDeleteDogProposeError,
    error: deleteDogProposeError
  }] = useDeleteDogProposeMutation();

  const [deleteFatherPropose, {
    isLoading: isDeleteFatherProposeLoading,
    isError: isDeleteFatherProposeError,
    error: deleteFatherProposeError
  }] = useDeleteFatherProposeMutation();

  const [deletePuppyPropose, {
    isLoading: isDeletePuppyProposeLoading,
    isError: isDeletePuppyProposeError,
    error: deletePuppyProposeError
  }] = useDeletePuppyProposeMutation();

  useEffect(() => {
    if (isDogProposesError) alerts.errorAlert(`${dogProposesError?.data?.message}aaa`)
  }, [isDogProposesError])

  useEffect(() => {
    if (isFatherProposesError) alerts.errorAlert(`${fatherProposesError?.data?.message}bbb`)
  }, [isFatherProposesError])

  useEffect(() => {
    if (isPuppyProposesError) alerts.errorAlert(`${puppyProposesError?.data?.message}ccc`)
  }, [isPuppyProposesError])

  useEffect(() => {
    if (isDeleteDogProposeError) alerts.errorAlert(`${deleteDogProposeError?.data?.message}`)
  }, [isDeleteDogProposeError])

  useEffect(() => {
    if (isDeleteFatherProposeError) alerts.errorAlert(`${deleteFatherProposeError?.data?.message}`)
  }, [isDeleteFatherProposeError])

  useEffect(() => {
    if (isDeletePuppyProposeError) alerts.errorAlert(`${deletePuppyProposeError?.data?.message}`)
  }, [isDeletePuppyProposeError])

  if (isDogProposesLoading || isFatherProposesLoading || isPuppyProposesLoading ||
    isDeleteDogProposeLoading || isDeleteFatherProposeLoading || isDeletePuppyProposeLoading) return

  if (isDogProposesSuccess && isFatherProposesSuccess && isPuppyProposesSuccess) {
    const { ids: dogProposeIds } = dogproposes;
    const { ids: fatherProposeIds } = fatherproposes;
    const { ids: puppyProposeIds } = puppyproposes;

    return (
      <>
        {dogProposeIds?.length > 0 && (
          <>
            <button
              title="Delete Dog Transfer Proposals Made by Me"
              className="black-button three-hundred"
              onClick={() => dogProposeIds?.forEach(async (id) => {
                await deleteDogPropose({ id });
              })}
            >
              Delete Dog Proposals Made by Me
            </button>
            <br />
            <br />
          </>
        )}
        {fatherProposeIds?.length > 0 && (
          <>
            <button
              title="Delete Father Proposals Made by Me"
              className="black-button three-hundred"
              onClick={() => fatherProposeIds?.forEach(async (id) => {
                await deleteFatherPropose({ id });
              })}
            >
              Delete Father Proposals Made by Me
            </button>
            <br />
            <br />
          </>
        )}
        {puppyProposeIds?.length > 0 && (
          <>
            <button
              title="Delete Puppy Proposals Made by Me"
              className="black-button three-hundred"
              onClick={() => puppyProposeIds?.forEach(async (id) => {
                await deletePuppyPropose({ id });
              })}
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

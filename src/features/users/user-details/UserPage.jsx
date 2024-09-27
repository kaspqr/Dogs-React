import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../user-slices/usersApiSlice";
import { useGetUserDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";
import ProposeTransfer from "./ProposeTransfer";
import ReceivedProposals from "./ReceivedProposals";
import DeleteProposals from "./DeleteProposals";
import DogsTable from "./DogsTable";
import AdvertisementsTable from "./AdvertisementsTable";
import { alerts } from "../../../components/alerts";
import MessageButton from "./MessageButton";

const UserPage = () => {
  const navigate = useNavigate();
  const { userId, isAdmin, isSuperAdmin } = useAuth();
  const { id } = useParams();

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

  const [updateUser, {
    isLoading: isUpdateLoading,
    isError: isUpdateError,
    error: updateError
  }] = useUpdateUserMutation();

  const {
    data: dogs,
    isLoading: isDogsLoading,
    isSuccess: isDogsSuccess,
    isError: isDogsError,
    error: dogsError,
  } = useGetUserDogsQuery({ id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isDogsError) alerts.errorAlert(`${dogsError?.data?.message}`);
  }, [isDogsError])

  useEffect(() => {
    if (isUpdateError) alerts.errorAlert(`${updateError?.data?.message}`);
  }, [isUpdateError])

  if (isLoading || isDogsLoading || isUpdateLoading) return

  if (isSuccess && isDogsSuccess) {
    if (!isAdmin && !isSuperAdmin && user?.active === false) return <p>This user is banned</p>;

    const { ids } = dogs;

    return (
      <>
        <p className="user-page-username">
          {user?.username}
          {userId === id ? (
            <button
              title="Edit Profile"
              className="user-page-edit-button black-button"
              onClick={() => navigate(`/users/edit/${id}`)}
            >
              Edit Profile
            </button>
          ) : null}
          {userId?.length && userId !== id ? <MessageButton userId={userId} id={id} /> : null}
        </p>
        {user?.image?.length && user?.image !== "none " ? (
          <>
            <p>
              <img
                width="300"
                height="300"
                className="user-profile-picture"
                src={user?.image}
                alt="User"
              />
            </p>
            <br />
          </>
        ) : null}
        <p>
          <b>{user?.name}</b>
        </p>
        <br />
        <p>
          <b>From </b>
          {user?.region && user?.region !== "none "
            ? `${user?.region}, `
            : null}
          {user?.country}
        </p>
        <br />
        {user?.bio?.length ? (
          <>
            <p>
              <b>Bio</b>
            </p>
            <p>{user.bio}</p>
            <br />
          </>
        ) : null}
        {userId?.length && userId !== id ? <ProposeTransfer user={user} userId={userId} /> : null}
        {!(userId?.length && userId !== id && ids?.length) ? null : <ReceivedProposals
          user={user}
          userId={userId}
          dogs={dogs}
        />}
        {id !== userId ? null : <DeleteProposals userId={userId} />}
        {userId?.length && id !== userId ? (
          <button
            title="Report User"
            className="black-button three-hundred"
            onClick={() => navigate(`/reportuser/${id}`)}
          >
            Report User
          </button>
        ) : null}
        {(isAdmin || isSuperAdmin) && !user?.roles?.includes("Admin", "SuperAdmin") && id !== userId ? (
          <>
            <br />
            <br />
            <button
              title={user?.active ? "Ban User" : "Unban User"}
              className="black-button three-hundred"
              onClick={async () => await updateUser({ id, active: !user?.active })}
            >
              {user?.active ? "Ban User" : "Unban User"}
            </button>
          </>
        ) : null}
        {isSuperAdmin && !user?.roles?.includes("SuperAdmin") && id !== userId ? (
          <>
            <br />
            <br />
            <button
              title="Make Admin"
              className="black-button three-hundred"
              onClick={async () => await updateUser({
                id,
                roles: !user?.roles?.includes("Admin") ? user?.roles?.concat(["Admin"]) : ["User"]
              })}
            >
              {!user?.roles?.includes("Admin") ? "Make Admin" : "Remove Admin"}
            </button>
          </>
        ) : null}
        {(userId !== id && userId?.length) && (
          <>
            <br />
            <br />
          </>
        )}
        <AdvertisementsTable user={user} />
        {!ids?.length ? null : <DogsTable ids={ids} />}
      </>
    );
  }

  return
};

export default UserPage;

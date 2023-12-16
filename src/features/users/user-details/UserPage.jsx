import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../user-slices/usersApiSlice";
import { useGetDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";
import {
  useGetConversationsQuery,
  useAddNewConversationMutation,
} from "../../conversations/conversationsApiSlice";
import { useGetDogProposesQuery } from "../../dogs/dog-slices/proposeDogApiSlice";
import ProposeTransfer from "./ProposeTransfer";
import ReceivedProposals from "./ReceivedProposals";
import DeleteProposals from "./DeleteProposals";
import DogsTable from "./DogsTable";
import AdvertisementsTable from "./AdvertisementsTable";
import { alerts } from "../../../components/alerts";

const UserPage = () => {
  const navigate = useNavigate();
  const { userId, isAdmin, isSuperAdmin } = useAuth();
  const { id } = useParams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [
    addNewConversation,
    { isError: isErrorNewConversation, error: errorNewConversation },
  ] = useAddNewConversationMutation();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  const [updateUser, { isError: isUpdateError, error: updateError }] =
    useUpdateUserMutation();

  const {
    data: conversations,
    isSuccess: isConversationSuccess,
    isError: isConversationError,
    error: conversationError,
  } = useGetConversationsQuery("conversationsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: dogproposes,
    isSuccess: isDogProposeSuccess,
    isError: isDogProposeError,
    error: dogProposeError,
  } = useGetDogProposesQuery("dogProposesList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: dogs,
    isSuccess,
    isError,
    error,
  } = useGetDogsQuery("dogsList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Dogs");
  if (isConversationError)
    alerts.errorAlert(
      `${conversationError?.data?.message}`,
      "Error Fetching Conversations"
    );
  if (isDogProposeError)
    alerts.errorAlert(
      `${dogProposeError?.data?.message}`,
      "Error Fetching Proposals"
    );
  if (isUpdateError)
    alerts.errorAlert(`${updateError?.data?.message}`, "Error Updating User");
  if (isErrorNewConversation)
    alerts.errorAlert(
      `${errorNewConversation?.data?.message}`,
      "Error Creating Conversation"
    );

  if (isSuccess && isDogProposeSuccess && isConversationSuccess) {
    const { ids, entities } = dogs;
    const { ids: proposeIds, entities: proposeEntities } = dogproposes;
    const { ids: conversationIds, entities: conversationEntities } =
      conversations;

    const usersConversationId = conversationIds?.find(
      (conversationId) =>
        (conversationEntities[conversationId].sender === id &&
          conversationEntities[conversationId].receiver === userId) ||
        (conversationEntities[conversationId].receiver === id &&
          conversationEntities[conversationId].sender === userId)
    );

    const filteredIds = ids?.filter(
      (dogId) => entities[dogId]?.user === user?.id
    );

    const handleEdit = () => navigate(`/users/edit/${id}`);
    const handleMessage = async () => {
      if (usersConversationId) {
        navigate(`/conversations/${usersConversationId}`);
      } else {
        const response = await addNewConversation({
          sender: userId,
          receiver: id,
        });

        if (response)
          navigate(`/conversations/${response?.data?.newConversationId}`);
      }
    };

    return (
      <>
        <p className="user-page-username">
          {user?.username}
          {userId === id ? (
            <button
              title="Edit Profile"
              className="user-page-edit-button black-button"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          ) : null}
          {userId?.length && userId !== id ? (
            <button
              title="Message User"
              className="user-page-edit-button black-button"
              onClick={handleMessage}
            >
              Message
            </button>
          ) : null}
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
        <ProposeTransfer
          user={user}
          userId={userId}
          ids={ids}
          entities={entities}
        />
        <ReceivedProposals
          user={user}
          userId={userId}
          proposeIds={proposeIds}
          entities={entities}
          proposeEntities={proposeEntities}
          filteredIds={filteredIds}
        />
        <DeleteProposals
          user={user}
          userId={userId}
          proposeIds={proposeIds}
          filteredIds={filteredIds}
          proposeEntities={proposeEntities}
        />
        {userId?.length && id !== userId ? (
          <button
            title="Report User"
            className="black-button three-hundred"
            onClick={() => navigate(`/reportuser/${id}`)}
          >
            Report User
          </button>
        ) : null}
        {(isAdmin || isSuperAdmin) &&
        !user?.roles?.includes("Admin", "SuperAdmin") &&
        id !== userId ? (
          user?.active ? (
            <>
              <br />
              <br />
              <button
                title="Ban User"
                className="black-button three-hundred"
                onClick={async () =>
                  await updateUser({ id: user?.id, active: false })
                }
              >
                Ban User
              </button>
            </>
          ) : (
            <>
              <br />
              <br />
              <button
                title="Unban User"
                className="black-button three-hundred"
                onClick={async () =>
                  await updateUser({ id: user?.id, active: true })
                }
              >
                Unban User
              </button>
            </>
          )
        ) : null}
        {isSuperAdmin &&
        !user?.roles?.includes("SuperAdmin") &&
        id !== userId ? (
          !user?.roles?.includes("Admin") ? (
            <>
              <br />
              <br />
              <button
                title="Make Admin"
                className="black-button three-hundred"
                onClick={async () =>
                  await updateUser({
                    id: user?.id,
                    roles: user?.roles?.concat(["Admin"]),
                  })
                }
              >
                Make Admin
              </button>
            </>
          ) : (
            <>
              <br />
              <br />
              <button
                title="Remove Admin"
                className="black-button three-hundred"
                onClick={async () =>
                  await updateUser({ id: user?.id, roles: ["User"] })
                }
              >
                Remove Admin
              </button>
            </>
          )
        ) : null}
        {userId !== user?.id && userId && (
          <>
            <br />
            <br />
          </>
        )}
        <AdvertisementsTable
          userId={userId}
          user={user}
          windowWidth={windowWidth}
        />
        <DogsTable
          filteredIds={filteredIds}
          windowWidth={windowWidth}
          user={user}
          userId={userId}
        />
      </>
    );
  }

  if (!user) return <p>User not found</p>;

  if (!isAdmin && !isSuperAdmin && user?.active === false)
    return <p>This user is banned</p>;
};

export default UserPage;

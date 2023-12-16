import { useParams } from "react-router-dom";

import EditAdvertisementForm from "./EditAdvertisementForm";
import { useGetAdvertisementsQuery } from "../advertisement-slices/advertisementsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";

const EditAdvertisement = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (advertisement.poster !== userId)
    return <p>This is not your advertisement</p>;

  return <EditAdvertisementForm advertisement={advertisement} users={users} />;
};

export default EditAdvertisement;

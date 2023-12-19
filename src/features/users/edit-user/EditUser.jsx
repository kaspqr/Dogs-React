import { useParams } from "react-router-dom";

import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "../user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";

const EditUser = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  if (!user) return;
  if (id !== userId) return <p>This is not your account</p>;

  return <EditUserForm user={user} />;
};

export default EditUser;

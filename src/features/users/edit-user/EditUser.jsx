import { useParams } from "react-router-dom";

import EditUserForm from "./EditUserForm";
import { useGetUserByIdQuery } from "../user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { useEffect } from "react";
import { alerts } from "../../../components/alerts";

const EditUser = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: userId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return

  if (isSuccess) {
    if (!user) return;
    if (id !== userId) return <p>This is not your account</p>;

    return <EditUserForm user={user} />;
  }
};

export default EditUser;

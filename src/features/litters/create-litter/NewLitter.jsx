import NewLitterForm from "./NewLitterForm";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import { useGetDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";

const NewLitter = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  const { dogs } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dogs: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <p>Loading...</p>;

  return <NewLitterForm users={users} dogs={dogs} />;
};

export default NewLitter;

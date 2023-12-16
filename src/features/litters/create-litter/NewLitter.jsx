import NewLitterForm from "./NewLitterForm";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import { useGetDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";

const NewLitter = () => {
  // GET all the users with their .values
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  // GET all the dogs with their .values
  const { dogs } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dogs: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <p>Loading...</p>;

  return <NewLitterForm users={users} dogs={dogs} />;
};

export default NewLitter;

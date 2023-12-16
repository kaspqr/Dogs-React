import { useParams } from "react-router-dom";

import EditDogForm from "./EditDogForm";
import { useGetDogsQuery } from "../dog-slices/dogsApiSlice";
import useAuth from "../../../hooks/useAuth";

const EditDog = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const { dog } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dog: data?.entities[id],
    }),
  });

  if (dog.user !== userId) return <p>This is not your dog</p>;

  return <EditDogForm dog={dog} />;
};

export default EditDog;

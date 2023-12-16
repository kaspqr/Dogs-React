import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetDogsQuery } from "../dog-slices/dogsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import DogIcon from "../../../config/images/DogIcon.jpg";

const Dog = ({ dogId }) => {
  const { dog } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dog: data?.entities[dogId],
    }),
  });

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[dog?.user],
    }),
  });

  if (!dog) return;

  const dogImageSource = dog?.image?.length ? dog?.image : DogIcon;

  return (
    <div className="dog-div">
      <div className="dog-div-image">
        <img
          width="150px"
          height="150px"
          className="dog-profile-picture"
          src={dogImageSource}
          alt="Dog"
        />
      </div>
      <div className="dog-div-info">
        <p>
          <Link className="orange-link" to={`/dogs/${dogId}`}>
            <b>{dog.name}</b>
          </Link>
        </p>
        <br />
        <p>{dog.breed}</p>
        <p>Good {dog.female === true ? "Girl" : "Boy"}</p>
        <p>Born {dog.birth?.split(" ").slice(1, 4).join(" ")}</p>
        <br />
        <p className="dog-div-admin">
          <span>
            Administered by{" "}
            <Link className="orange-link" to={`/users/${user?.id}`}>
              <b>{user?.username}</b>
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

const memoizedDog = memo(Dog);

export default memoizedDog;

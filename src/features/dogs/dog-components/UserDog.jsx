import { memo } from "react";
import { Link } from "react-router-dom";

import { useGetDogsQuery } from "../dog-slices/dogsApiSlice";
import DogIcon from "../../../config/images/DogIcon.jpg";

const UserDog = ({ dogId }) => {
  const { dog } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dog: data?.entities[dogId],
    }),
  });

  if (!dog) return;

  return (
    <div className="dog-div">
      <div className="dog-div-image">
        <img
          width="150px"
          height="150px"
          className="dog-profile-picture"
          src={dog?.image?.length ? dog?.image : DogIcon}
          alt="Dog"
        />
      </div>
      <div className="dog-div-info">
        <p>
          <Link className="orange-link" to={`/dogs/${dog.id}`}>
            <b>{dog.name}</b>
          </Link>
        </p>
        <br />
        <p>{dog.breed}</p>
        <p>Good {dog.female === true ? "Girl" : "Boy"}</p>
        <p>Born {dog.birth.split(" ").slice(1, 4).join(" ")}</p>
      </div>
    </div>
  );
};

const memoizedUserDog = memo(UserDog);

export default memoizedUserDog;

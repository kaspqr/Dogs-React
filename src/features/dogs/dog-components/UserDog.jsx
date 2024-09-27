import { memo, useEffect } from "react";
import { Link } from "react-router-dom";

import { useGetDogByIdQuery } from "../dog-slices/dogsApiSlice";
import DogIcon from "../../../config/images/DogIcon.jpg";
import { alerts } from "../../../components/alerts";

const UserDog = ({ dogId }) => {
  const {
    data: dog,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id: dogId }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  if (isLoading) return;

  if (isSuccess) {
    if (!dog) return
    
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
  }

  return
};

const memoizedUserDog = memo(UserDog);

export default memoizedUserDog;

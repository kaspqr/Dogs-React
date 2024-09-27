import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDeleteDogMutation, useGetDogByIdQuery } from "../dog-slices/dogsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";
import { hasRegion } from "../../../config/utils";
import { INSTAGRAM_ICON, FACEBOOK_ICON, YOUTUBE_ICON, TIKTOK_ICON } from "../../../config/svgs";
import DogSiblings from "./DogSiblings";
import DogLitters from "./DogLitters";
import ParentLitter from "../../litters/litter-details/ParentLitter";
import DogUserInfo from "../../users/user-details/DogUserInfo";

const DogPage = () => {
  const navigate = useNavigate();
  const { userId, isAdmin, isSuperAdmin } = useAuth();
  const { dogid } = useParams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: dog,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id: dogid }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [deleteDog, {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError,
  }] = useDeleteDogMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(error?.data?.message);
  }, [isError]);

  useEffect(() => {
    if (isDelError) alerts.errorAlert(delError?.data?.message);
  }, [isDelError]);

  useEffect(() => {
    if (isDelSuccess) navigate("/dogs");
  }, [isDelSuccess]);

  if (isLoading || isDelLoading) return

  if (isSuccess) {
    if (!dog) return

    return (
      <>
        <p>
          <span className="dog-page-name">{dog?.name}</span>
          {windowWidth > 600 ? null : <br />}
          <span className={windowWidth > 600 ? "nav-right" : null}>
            <b>Administered by</b>{" "}
            <DogUserInfo userId={dog?.user} />
          </span>
        </p>
        <p>
          {dog?.instagram?.length && dog?.instagram !== "none " && (
            <a
              href={
                dog?.instagram?.length &&
                dog?.instagram !== "none " &&
                `https://instagram.com/${dog?.instagram}`
              }
              rel="noreferrer"
              target="_blank"
            >
              {INSTAGRAM_ICON}
            </a>
          )}
          {dog?.facebook?.length && dog?.facebook !== "none " && (
            <a
              href={`https://facebook.com/${dog?.facebook}`}
              rel="noreferrer"
              target="_blank"
            >
              {FACEBOOK_ICON}
            </a>
          )}
          {dog?.youtube?.length && dog?.youtube !== "none " && (
            <a
              href={`https://youtube.com/@${dog?.youtube}`}
              rel="noreferrer"
              target="_blank"
            >
              {YOUTUBE_ICON}
            </a>
          )}
          {dog?.tiktok?.length && dog?.tiktok !== "none " && (
            <a
              href={`https://tiktok.com/@${dog?.tiktok}`}
              rel="noreferrer"
              target="_blank"
            >
              {TIKTOK_ICON}
            </a>
          )}
        </p>
        <br />
        {dog?.image?.length && (
          <>
            <p>
              <img
                width="300"
                height="300"
                className="dog-profile-picture"
                src={dog?.image}
                alt="Dog"
              />
            </p>
            <br />
          </>
        )}
        <p className="main-dog-info-title">
          <b>Main Info</b>
        </p>
        <br />
        <p>
          <b>Good {dog?.female === true ? "Girl" : "Boy"}</b>
        </p>
        <p>
          <b>{dog?.breed}</b>
        </p>
        <p>
          <b>Born </b>
          {dog?.birth?.split(" ").slice(1, 4).join(" ")}
        </p>
        {dog?.death?.length && dog?.death !== "none " && (
          <p>
            <b>Entered Dog Heaven on </b>
            {dog?.death?.split(" ").slice(1, 4).join(" ")}
          </p>
        )}
        <p>
          <b>From </b>
          {hasRegion(dog) ? `${dog?.region}, ` : null}
          {dog?.country}
        </p>
        <br />
        <p>
          <b>{dog?.passport === true ? "Has " : "Does Not Have "}a Passport</b>
        </p>
        <p>
          <b>
            {dog?.sterilized === true && "Not "}
            {dog?.female === true ? "Sterilized" : "Castrated"}
          </b>
        </p>
        {dog?.female === true && dog?.sterilized === false && (
          <p>
            <b>
              Currently {dog?.heat === false && "Not "}
              in Heat
            </b>
          </p>
        )}
        <p>
          <b>
            {dog?.microchipped === false && "Not "}
            Microchipped
          </b>
        </p>
        {dog?.microchipped === true &&
          dog?.chipnumber?.length &&
          dog?.chipnumber !== "none " && (
            <p>
              <b>Chipnumber </b>
              {dog?.chipnumber}
            </p>
          )}
        <br />
        {dog?.info && dog?.info !== "none " && (
          <>
            <p>
              <b>Additional Info</b>
            </p>
            <p>{dog?.info}</p>
            <br />
          </>
        )}
        <p className="family-tree-title">
          <b>Instant Family Tree</b>
        </p>
        <br />
        {dog?.litter
          ? <>
            <ParentLitter dog={dog} />
            <DogSiblings
              dog={dog}
            />
          </>
          : <p>
            {dog?.name} is not added to any litter and therefore has no parents
            or siblings in the database
          </p>
        }
        <br />
        <DogLitters dog={dog} />
        {userId === dog?.user && (
          <>
            <button
              title="Edit Dog"
              className="black-button three-hundred"
              onClick={() => navigate(`/dogs/edit/${dog?.id}`)}
            >
              Edit
            </button>
            <br />
            <br />
          </>
        )}
        {userId?.length && dog?.user !== userId && (
          <>
            <button
              className="black-button three-hundred"
              onClick={() => navigate(`/reportdog/${dog?.id}`)}
            >
              Report Dog
            </button>
            <br />
            <br />
          </>
        )}
        {(isAdmin || isSuperAdmin) && (
          <>
            <button
              title="Delete as Admin"
              className="black-button three-hundred"
              onClick={async () => {
                await deleteDog({ id: dog?.id })
                navigate("/dogs")
              }}
            >
              Delete as Admin
            </button>
          </>
        )}
      </>
    );
  }

  return;
};

export default DogPage;

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetAdvertisementsQuery,
  useDeleteAdvertisementMutation,
} from "../advertisement-slices/advertisementsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";
import { BREEDING_TYPES, PRICELESS_TYPES } from "../../../config/consts";

const AdvertisementPage = () => {
  const navigate = useNavigate();
  const { userId, isAdmin, isSuperAdmin } = useAuth();
  const { advertisementid } = useParams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const widescreen = windowWidth > 600;

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[advertisementid],
    }),
  });

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[advertisement?.poster],
    }),
  });

  const [
    deleteAdvertisement,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteAdvertisementMutation();

  useEffect(() => {
    if (isDelLoading)
      alerts.loadingAlert("Deleting Advertisement", "Loading...");
    else Swal.close();
  }, [isDelLoading]);

  const handleResize = () => setWindowWidth(window.innerWidth);

  if (!advertisement) return;

  if (isDelError)
    alerts.errorAlert(
      `${delError?.data?.message}`,
      "Error Deleting Advertisement"
    );
  if (isDelSuccess) navigate("/");

  return (
    <>
      <p className="advertisement-title-p">
        <span className="advertisement-page-title">{advertisement?.title}</span>
        {widescreen ? null : <br />}
        <span className={widescreen ? "nav-right" : null}>
          <b>
            Posted by{" "}
            <Link className="orange-link" to={`/users/${user?.id}`}>
              {user?.username}
            </Link>
          </b>
        </span>
      </p>
      {advertisement?.image?.length && (
        <>
          <p>
            <img
              className="three-hundred"
              src={advertisement?.image}
              alt="Advertisement"
            />
          </p>
          <br />
        </>
      )}
      <p>
        <b>{advertisement?.type}</b>
      </p>
      <p>
        {!BREEDING_TYPES.includes(advertisement?.type)
          ? null
          : advertisement?.breed?.length
          ? advertisement?.breed
          : "Any breed"}
      </p>
      {!PRICELESS_TYPES.includes(advertisement?.type) && (
        <p>
          <b>
            {advertisement?.currency}
            {advertisement?.price}
          </b>
        </p>
      )}
      <br />
      <p>
        <b>Location</b>
      </p>
      <p>
        {advertisement?.region ? advertisement?.region + ", " : null}
        {advertisement?.country}
      </p>
      <br />
      <p>
        <b>Info</b>
      </p>
      <p>{advertisement?.info}</p>
      <br />
      {userId === advertisement?.poster && (
        <>
          <Link
            className="edit-advertisement-link"
            to={`/advertisements/edit/${advertisement?.id}`}
          >
            <button title="Edit" className="black-button three-hundred">
              Edit
            </button>
          </Link>
        </>
      )}
      {userId?.length && advertisement?.poster !== userId && (
        <>
          <button
            className="black-button three-hundred"
            onClick={() =>
              navigate(`/reportadvertisement/${advertisement?.id}`)
            }
          >
            Report Advertisement
          </button>
          <br />
          <br />
        </>
      )}
      {(isAdmin || isSuperAdmin) && (
        <button
          title="Delete as Admin"
          className="black-button three-hundred"
          onClick={async () => {
            await deleteAdvertisement({ id: advertisement?.id });
          }}
        >
          Delete as Admin
        </button>
      )}
    </>
  );
};

export default AdvertisementPage;

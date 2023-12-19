import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetAdvertisementReportsQuery,
  useDeleteAdvertisementReportMutation,
} from "../../advertisementreports/advertisementReportsApiSlice";
import { useGetAdvertisementsQuery } from "../../advertisements/advertisement-slices/advertisementsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";

const ReportedAdvertisementPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { advertisementreportid } = useParams();

  const { advertisementReport } = useGetAdvertisementReportsQuery(
    "advertisementReportsList",
    {
      selectFromResult: ({ data }) => ({
        advertisementReport: data?.entities[advertisementreportid],
      }),
    }
  );

  const [
    deleteAdvertisementReport,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteAdvertisementReportMutation();

  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[advertisementReport?.advertisement],
    }),
  });

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[advertisementReport?.reporter],
    }),
  });

  useEffect(() => {
    if (isDelLoading) alerts.loadingAlert("Deleting Report", "Loading...");
    else Swal.close();
  }, [isDelLoading]);

  if (!isAdmin && !isSuperAdmin)
    return <p>You are not logged in as an admin.</p>;
  if (!advertisementReport) return;

  if (isDelError)
    alerts.errorAlert(`${delerror?.data?.message}`, "Error Deleting Report");
  if (isDelSuccess) navigate("/advertisementreports");

  return (
    <>
      <p>
        <b>Report ID {advertisementReport?.id}</b>
      </p>
      <p>
        <b>
          Advertisement Title{" "}
          <Link
            className="orange-link"
            to={`/advertisements/${advertisement?.id}`}
          >
            {advertisement?.title}
          </Link>
        </b>
      </p>
      <p>
        <b>
          Reporter{" "}
          <Link className="orange-link" to={`/users/${user?.id}`}>
            {user?.username}
          </Link>
        </b>
      </p>
      <p>
        <b>Reason for reporting</b>
      </p>
      <p>{advertisementReport?.text}</p>
      <br />
      <button
        onClick={async () => {
          await deleteAdvertisementReport({ id: advertisementReport?.id });
        }}
        className="black-button"
      >
        Delete Report
      </button>
    </>
  );
};

export default ReportedAdvertisementPage;

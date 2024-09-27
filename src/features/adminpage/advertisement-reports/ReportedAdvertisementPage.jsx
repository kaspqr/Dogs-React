import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  useGetAdvertisementReportsQuery,
  useDeleteAdvertisementReportMutation,
} from "../../advertisementreports/advertisementReportsApiSlice";
import { useGetAdvertisementByIdQuery } from "../../advertisements/advertisement-slices/advertisementsApiSlice";
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice"
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";

const ReportedAdvertisementPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { advertisementreportid } = useParams();

  const { advertisementReport } = useGetAdvertisementReportsQuery("advertisementReportsList", {
    selectFromResult: ({ data }) => ({
      advertisementReport: data?.entities[advertisementreportid],
    }),
  });

  const {
    data: advertisement,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementByIdQuery({ id: advertisementReport?.advertisement }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError
  } = useGetUserByIdQuery({ id: advertisementReport?.reporter }, {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
  });

  const [deleteAdvertisementReport, {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError,
  }] = useDeleteAdvertisementReportMutation();

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}aaa`);
  }, [isError]);

  useEffect(() => {
    if (isUserError) alerts.errorAlert(`${userError?.data?.message}`);
  }, [isUserError]);

  useEffect(() => {
    if (isDelError) alerts.errorAlert(`${delError?.data?.message}`);
  }, [isDelError]);

  useEffect(() => {
    if (isDelSuccess) navigate("/advertisementreports");
  }, [isDelSuccess]);

  if (isLoading || isUserLoading || isDelLoading || !advertisementReport) return

  if (!isAdmin && !isSuperAdmin) return <p>You are not logged in as an admin.</p>

  if (isSuccess && isUserSuccess) {
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
          onClick={async () => await deleteAdvertisementReport({ id: advertisementReport?.id })}
          className="black-button"
        >
          Delete Report
        </button>
      </>
    );
  }

  return
};

export default ReportedAdvertisementPage;

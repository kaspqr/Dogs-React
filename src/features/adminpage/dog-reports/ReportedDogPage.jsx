import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useGetDogReportsQuery, useDeleteDogReportMutation } from "../../dogreports/dogReportsApiSlice";
import { useGetDogByIdQuery } from "../../dogs/dog-slices/dogsApiSlice";
import { useGetUserByIdQuery } from "../../users/user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { alerts } from "../../../components/alerts";

const ReportedDogPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { dogreportid } = useParams();

  const { dogReport } = useGetDogReportsQuery("dogReportsList", {
    selectFromResult: ({ data }) => ({
      dogReport: data?.entities[dogreportid],
    }),
  });

  const [deleteDogReport, {
    isLoading: isDelLoading,
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError,
  }] = useDeleteDogReportMutation();

  const {
    data: dog,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDogByIdQuery({ id: dogReport?.dog }, {
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
  } = useGetUserByIdQuery({ id: dogReport?.reporter }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isDelSuccess) navigate("/dogreports");
  }, [isDelSuccess]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isDelError) alerts.errorAlert(`${delError?.data?.message}`);
  }, [isDelError]);

  useEffect(() => {
    if (isUserError) alerts.errorAlert(`${userError?.data?.message}`);
  }, [isUserError]);

  if (isLoading || isDelLoading || isUserLoading || !dogReport) return

  if (!isAdmin && !isSuperAdmin) return <p>You are not logged in as an admin.</p>

  if (isSuccess && isUserSuccess) {
    return (
      <>
        <p>
          <b>Report ID {dogReport?.id}</b>
        </p>
        <p>
          <b>
            Dog{" "}
            <Link className="orange-link" to={`/dogs/${dog?.id}`}>
              {dog?.name}
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
        <p>{dogReport?.text}</p>
        <br />
        <button
          onClick={async () => {
            await deleteDogReport({ id: dogReport?.id });
          }}
          className="black-button"
        >
          Delete Report
        </button>
      </>
    );
  }

  return
};

export default ReportedDogPage;

import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useGetDogReportsQuery,
  useDeleteDogReportMutation,
} from "../../dogreports/dogReportsApiSlice";
import { useGetDogsQuery } from "../../dogs/dog-slices/dogsApiSlice";
import { useGetUsersQuery } from "../../users/user-slices/usersApiSlice";
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

  const [
    deleteDogReport,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteDogReportMutation();

  const { dog } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dog: data?.entities[dogReport?.dog],
    }),
  });

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[dogReport?.reporter],
    }),
  });

  if (!isAdmin && !isSuperAdmin)
    return <p>You are not logged in as an admin.</p>;
  if (!dogReport) return;

  const handleDelete = async () => await deleteDogReport({ id: dogReport?.id });

  if (isDelLoading) alerts.loadingAlert("Deleting report");
  if (isDelError) alerts.errorAlert(delerror?.data?.message);

  if (isDelSuccess) {
    Swal.close();
    navigate("/dogreports");
  }

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
      <button onClick={handleDelete} className="black-button">
        Delete Report
      </button>
    </>
  );
};

export default ReportedDogPage;

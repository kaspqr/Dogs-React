import { useGetUserByIdQuery } from "../users/user-slices/usersApiSlice";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useAddNewUserReportMutation } from "./userReportsApiSlice";
import { alerts } from "../../components/alerts";

const UserReportPage = () => {
  const { userId } = useAuth();
  const { userid } = useParams();

  const [report, setReport] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUserByIdQuery({ id: userid }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewUserReport, {
    isLoading: isAddReportLoading,
    isSuccess: isAddReportSuccess,
    isError: isAddReportError,
    error: addReportError
  }] = useAddNewUserReportMutation();

  useEffect(() => {
    if (isAddReportSuccess) {
      setReport("");
      setSuccessMsg("Thank You! We have received your report.");
    }
  }, [isAddReportSuccess]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`)
  }, [isError])

  useEffect(() => {
    if (isAddReportError) alerts.errorAlert(`${addReportError?.data?.message}`)
  }, [isAddReportError])

  if (userid === userId) return <p>You cannot report yourself.</p>;

  if (isLoading || isAddReportLoading) return

  if (isSuccess) {
    if (successMsg?.length) return <p>{successMsg}</p>

    return (
      <>
        <label htmlFor="report">
          <b>
            Reason for reporting user{" "}
            <Link
              target="_blank"
              className="orange-link"
              to={`/users/${userid}`}
            >
              {user?.username}
            </Link>
          </b>
        </label>
        <br />
        <textarea
          className="top-spacer three-hundred"
          value={report}
          onChange={(e) => setReport(e.target.value)}
          name="report"
          id="report"
          maxLength="900"
          cols="30"
          rows="10"
        />
        <br />
        <br />
        <button
          title="Report User"
          className="black-button three-hundred"
          onClick={async () => await addNewUserReport({ reportee: userid, reporter: userId, text: report })}
          disabled={report?.length < 1}
          style={report?.length < 1 ? { backgroundColor: "grey", cursor: "default" } : null}
        >
          Report
        </button>
      </>
    );
  }

  return
};

export default UserReportPage;

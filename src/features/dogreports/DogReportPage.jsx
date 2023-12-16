import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetDogsQuery } from "../dogs/dog-slices/dogsApiSlice";
import { useAddNewDogReportMutation } from "./dogReportsApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const DogReportPage = () => {
  const { userId } = useAuth();
  const { dogid } = useParams();

  const [report, setReport] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { dog } = useGetDogsQuery("dogsList", {
    selectFromResult: ({ data }) => ({
      dog: data?.entities[dogid],
    }),
  });

  const [addNewDogReport, { isLoading, isSuccess, isError, error }] =
    useAddNewDogReportMutation();

  useEffect(() => {
    if (isSuccess) {
      Swal.close();
      setReport("");
      setSuccessMsg("Thank You! We have received your report.");
    }
  }, [isSuccess]);

  if (dog?.user === userId) return <p>You cannot report your own dog.</p>;

  const handleReportClicked = async () =>
    await addNewDogReport({ dog: dogid, reporter: userId, text: report });

  const buttonDisabled = report?.length < 1;
  const buttonStyle = buttonDisabled ? DISABLED_BUTTON_STYLE : null;

  if (isLoading) alerts.loadingAlert("Reporting dog");
  if (isError) alerts.errorAlert(error?.data?.message);

  if (successMsg?.length) return <p>{successMsg}</p>;

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="report">
          <b>
            Reason for reporting dog{" "}
            <Link
              target="_blank"
              className="orange-link"
              to={`/dogs/${dog?.id}`}
            >
              {dog?.name}
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
          title="Report Dog"
          className="black-button three-hundred"
          onClick={handleReportClicked}
          disabled={buttonDisabled}
          style={buttonStyle}
        >
          Report
        </button>
      </form>
    </>
  );
};

export default DogReportPage;

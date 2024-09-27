import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useGetDogByIdQuery } from "../dogs/dog-slices/dogsApiSlice";
import { useAddNewDogReportMutation } from "./dogReportsApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const DogReportPage = () => {
  const { userId } = useAuth();
  const { dogid } = useParams();

  const [report, setReport] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  const [addNewDogReport, {
    isLoading: isAddReportLoading,
    isSuccess: isAddReportSuccess,
    isError: isAddReportError,
    error: addReportError
  }] = useAddNewDogReportMutation();

  useEffect(() => {
    if (isAddReportSuccess) {
      setReport("");
      setSuccessMsg("Thank You! We have received your report.");
    }
  }, [isAddReportSuccess]);

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isAddReportError) alerts.errorAlert(`${addReportError?.data?.message}`);
  }, [isAddReportError]);

  if (isLoading || isAddReportLoading) return

  if (isSuccess) {
    if (dog?.user === userId) return <p>You cannot report your own dog.</p>;

    if (successMsg?.length) return <p>{successMsg}</p>;

    return (
      <>
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
          onClick={async () => await addNewDogReport({ dog: dogid, reporter: userId, text: report })}
          disabled={report?.length < 1}
          style={report?.length < 1 ? DISABLED_BUTTON_STYLE : null}
        >
          Report
        </button>
      </>
    );
  }

  return
};

export default DogReportPage;

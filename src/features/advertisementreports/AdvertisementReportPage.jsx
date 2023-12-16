import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetAdvertisementsQuery } from "../advertisements/advertisement-slices/advertisementsApiSlice";
import { useAddNewAdvertisementReportMutation } from "./advertisementReportsApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const AdvertisementReportPage = () => {
  const { userId } = useAuth();
  const { advertisementid } = useParams();

  const [report, setReport] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { advertisement } = useGetAdvertisementsQuery("advertisementsList", {
    selectFromResult: ({ data }) => ({
      advertisement: data?.entities[advertisementid],
    }),
  });

  const [addNewAdvertisementReport, { isLoading, isSuccess, isError, error }] =
    useAddNewAdvertisementReportMutation();

  useEffect(() => {
    if (isSuccess) {
      Swal.close();
      setReport("");
      setSuccessMsg("Thank You! We have received your report.");
    }
  }, [isSuccess]);

  if (advertisement?.poster === userId)
    return <p>You cannot report your own advertisement.</p>;

  const handleReportClicked = async () =>
    await addNewAdvertisementReport({
      advertisement: advertisementid,
      reporter: userId,
      text: report,
    });

  const canReport = report?.length > 1;
  const reportButtonStyle = canReport ? null : DISABLED_BUTTON_STYLE;

  if (isLoading) alerts.loadingAlert("Sending report");
  if (isError) alerts.errorAlert(error?.data?.message);

  const content = successMsg?.length ? (
    <p>{successMsg}</p>
  ) : (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="report">
          <b>
            Reason for reporting advertisement{" "}
            <Link
              target="_blank"
              className="orange-link"
              to={`/advertisements/${advertisement?.id}`}
            >
              {advertisement?.title}
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
          title="Report Advertisement"
          className="black-button three-hundred"
          onClick={handleReportClicked}
          disabled={!canReport}
          style={reportButtonStyle}
        >
          Report
        </button>
      </form>
    </>
  );

  return content;
};

export default AdvertisementReportPage;

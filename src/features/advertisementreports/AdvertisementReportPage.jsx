import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useGetAdvertisementByIdQuery } from "../advertisements/advertisement-slices/advertisementsApiSlice";
import { useAddNewAdvertisementReportMutation } from "./advertisementReportsApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const AdvertisementReportPage = () => {
  const { userId } = useAuth();
  const { advertisementid } = useParams();

  const [report, setReport] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    data: advertisement,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetAdvertisementByIdQuery({ id: advertisementid }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [addNewAdvertisementReport, {
    isLoading: isAddReportLoading,
    isSuccess: isAddReportSuccess,
    isError: isAddReportError,
    error: addReportError
  }] = useAddNewAdvertisementReportMutation();

  useEffect(() => {
    if (isAddReportSuccess) {
      setReport("");
      setSuccessMsg("Thank You! We have received your report.");
    }
  }, [isAddReportSuccess]);

  useEffect(() => {
    if (isError) alerts.loadingAlert(`${error?.data?.message}`);
  }, [isError]);

  useEffect(() => {
    if (isAddReportError) alerts.loadingAlert(`${addReportError?.data?.message}`);
  }, [isAddReportError]);

  if (isLoading || isAddReportLoading) return

  if (isSuccess) {
    if (advertisement?.poster === userId) return <p>You cannot report your own advertisement.</p>

    if (successMsg?.length) return <p>{successMsg}</p>

    return (
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
            onClick={async () =>
              await addNewAdvertisementReport({
                advertisement: advertisementid,
                reporter: userId,
                text: report,
              })
            }
            disabled={report?.length <= 1}
            style={report?.length > 1 ? null : DISABLED_BUTTON_STYLE}
          >
            Report
          </button>
        </form>
      </>
    );
  }

  return
};

export default AdvertisementReportPage;

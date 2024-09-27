import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetEmailTokenQuery } from "./auth-slices/emailTokensApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";

const NewEmail = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: emailToken,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEmailTokenQuery("emailTokensList", {
    pollingInterval: 600000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError]);

  if (isLoading) return

  if (userId?.length) return <h1>Please logout before verifying an account</h1>;

  const successMsg = (
    <>
      <p>Email Verified Successfully</p>
      <br />
      <p>
        <button onClick={() => navigate("/login")} className="black-button">
          Login
        </button>
      </p>
    </>
  );

  const verifyEmailUrl = async () => {
    try {
      const response = await fetch(
        `https://pawretriever-api.onrender.com/users/${params.id}/verifyemail/${params.emailtoken}`
      );

      if (response.status === 200) {
        return successMsg;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isSuccess) {
    if (!emailToken) return <h1>Invalid Link</h1>;

    verifyEmailUrl();

    return successMsg;
  }

  return;
};

export default NewEmail;

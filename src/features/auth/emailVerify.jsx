import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetTokensQuery } from "./auth-slices/tokensApiSlice";
import { useGetUsersQuery } from "../users/user-slices/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";

const EmailVerify = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[params.id],
    }),
  });

  const {
    data: tokens,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTokensQuery("tokensList", {
    pollingInterval: 75000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isLoading) alerts.loadingAlert("Fetching Tokens", "Loading...");
    else Swal.close();
  }, [isLoading]);

  const verifyEmailUrl = async () => {
    try {
      const response = await fetch(
        `https://pawretriever-api.onrender.com/users/${params.id}/verify/${params.token}`
      );

      if (response.status === 200) return successMsg;
    } catch (error) {
      console.log(error);
    }
  };

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

  if (userId?.length) return <h1>Please logout before verifying an account</h1>;

  if (user?.verified === true) {
    return (
      <>
        <p>This account has already been verified</p>
        <br />
        <p>
          <button onClick={() => navigate("/login")} className="black-button">
            Login
          </button>
        </p>
      </>
    );
  }

  if (isError)
    alerts.errorAlert(`${error?.data?.message}`, "Error Fetching Tokens");

  if (isSuccess) {
    const { ids, entities } = tokens;

    const filteredId = ids.find((tokenId) => {
      return (
        entities[tokenId].token === params?.token &&
        entities[tokenId].user === params?.id
      );
    });

    if (!filteredId) return <h1>Invalid Link</h1>;

    if (filteredId) {
      const token = entities[filteredId];

      if (!user?.id?.length || token?.user !== user?._id) {
        return <h1>Invalid Link</h1>;
      }

      verifyEmailUrl();
      return successMsg;
    }
  }

  return successMsg;
};

export default EmailVerify;

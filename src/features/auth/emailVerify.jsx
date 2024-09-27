import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetTokenQuery } from "./auth-slices/tokensApiSlice";
import { useGetUserByIdQuery } from "../users/user-slices/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";

const EmailVerify = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const {
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError
  } = useGetUserByIdQuery({ id: params?.id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: token,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTokenQuery({ token: params?.token, user: params?.id }, {
    pollingInterval: 600000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isUserError) alerts.errorAlert(`${userError?.data?.message}`);
  }, [isUserError])

  if (isLoading || isUserLoading) return

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
        `https://pawretriever-api.onrender.com/users/${params.id}/verify/${params.token}`
      );

      if (response.status === 200) return successMsg;
    } catch (error) {
      console.log(error);
    }
  };

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

  if (isSuccess && isUserSuccess) {
    if (!token) return <h1>Invalid Link</h1>;

    if (!user?.id?.length || token?.user !== user?._id) return <h1>Invalid Link</h1>;

    verifyEmailUrl();
    
    return successMsg;
  }

  return;
};

export default EmailVerify;

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";
import { useGetResetTokensQuery } from "./auth-slices/resetTokensApiSlice";
import {
  useResetPasswordMutation,
  useGetUsersQuery,
} from "../users/user-slices/usersApiSlice";
import { alerts } from "../../components/alerts";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const ResetPassword = () => {
  const navigate = useNavigate();

  const { id, resettoken } = useParams();

  const { userId } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  const [
    resetPassword,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useResetPasswordMutation();

  const {
    data: resettokens,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetResetTokensQuery("resetTokensList", {
    pollingInterval: 75000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword({ id: id, password: password });
  };

  if (isError) alerts.errorAlert(error?.data?.message);
  if (isUpdateError) alerts.errorAlert(updateError?.data?.message);

  const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/;
  const validPassword =
    PASSWORD_REGEX.test(password) && password === confirmPassword;
  const changePasswordButtonStyle = !validPassword
    ? DISABLED_BUTTON_STYLE
    : null;

  if (userId?.length)
    return <p>You need to be logged out before resetting your password</p>;
  if (!user) return <p>Invalid Link</p>;

  if (isLoading) alerts.loadingAlert("Checking token");
  if (isUpdateLoading) alerts.loadingAlert("Updating password");

  if (isSuccess) {
    Swal.close();

    const { ids, entities } = resettokens;

    const filteredId = ids.find((tokenId) => {
      return (
        entities[tokenId].resetToken === resettoken &&
        entities[tokenId].user === id
      );
    });

    if (!filteredId) return <h1>Invalid Link</h1>;
  }

  if (isUpdateSuccess) {
    Swal.close();

    return (
      <>
        <p>Your password has been updated. You may now login.</p>
        <br />
        <p>
          <button
            title="Login"
            className="black-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <header>
        <p className="login-page-title">Choose Password</p>
      </header>
      <main>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="password">
            <b>Password (8-20 Characters, Optionally Including !@#%)*</b>
          </label>
          <br />
          <input
            className="three-hundred"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <label className="top-spacer" htmlFor="confirm-password">
            <b>Confirm Password</b>
          </label>
          <br />
          <input
            className="three-hundred"
            type="password"
            id="confirm-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
          <br />
          <br />
        </form>
        <button
          title="Change Password"
          onClick={handleSubmit}
          className="black-button three-hundred"
          disabled={!validPassword}
          style={changePasswordButtonStyle}
        >
          Change Password
        </button>
      </main>
    </>
  );
};

export default ResetPassword;

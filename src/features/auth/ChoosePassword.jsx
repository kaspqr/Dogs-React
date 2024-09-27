import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { useGetResetTokenQuery } from "./auth-slices/resetTokensApiSlice";
import { useResetPasswordMutation } from "../users/user-slices/usersApiSlice";
import { alerts } from "../../components/alerts";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, resettoken } = useParams();
  const { userId } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, {
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError,
  }] = useResetPasswordMutation();

  const {
    data: token,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetResetTokenQuery({ resetToken: resettoken, user: id }, {
    pollingInterval: 600000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError) alerts.errorAlert(`${error?.data?.message}`);
  }, [isError])

  useEffect(() => {
    if (isUpdateError) alerts.errorAlert(`${updateError?.data?.message}`);
  }, [isUpdateError])

  useEffect(() => {
    if (isUpdateSuccess) return (
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
  }, [isUpdateSuccess])

  if (isLoading || isUpdateLoading) return

  const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/;
  const validPassword = PASSWORD_REGEX.test(password) && password === confirmPassword;

  if (userId?.length) return <p>You need to be logged out before resetting your password</p>;

  if (isSuccess) {
    if (!token) return <p>Invalid Link</p>;

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
            onClick={async (e) => {
              e.preventDefault();
              await resetPassword({ id: id, password: password });
            }}
            className="black-button three-hundred"
            disabled={!validPassword}
            style={!validPassword ? DISABLED_BUTTON_STYLE : null}
          >
            Change Password
          </button>
        </main>
      </>
    );
  }

  return
};

export default ResetPassword;

import { useState, useEffect } from "react";

import useAuth from "../../hooks/useAuth";
import { useAddNewResetTokenMutation } from "./auth-slices/resetTokensApiSlice";
import { DISABLED_BUTTON_STYLE } from "../../config/consts";

const ResetPassword = () => {
  const { userId } = useAuth();

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [addNewResetToken, { isLoading, isSuccess, isError, error }] = useAddNewResetTokenMutation();

  useEffect(() => {
    if (isError) setErrMsg(error?.data?.message);
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setEmail("");
      setConfirmEmail("");
      setErrMsg(
        "A link to reset your password has been sent to the specified email address. " +
          "Please check the Spam folder if you cannot find it in your Primary emails."
      );
    }
  }, [isSuccess]);

  const invalidEmail = !EMAIL_REGEX.test(email) || email !== confirmEmail;

  if (userId?.length) return <p>You need to be logged out before resetting your password</p>;

  if (isLoading) return;

  return (
    <>
      <header>
        <p className="login-page-title">Reset Password</p>
      </header>
      {errMsg?.length ? <p>{errMsg}</p> : null}
      <main>
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
        />
        <br />
        <label className="top-spacer" htmlFor="confirm-email">
          <b>Confirm Email</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="confirm-email"
          onChange={(e) => setConfirmEmail(e.target.value)}
          value={confirmEmail}
          required
        />
        <br />
        <br />
        <button
          title="Request Link"
          onClick={async () => await addNewResetToken({ email })}
          className="black-button three-hundred"
          disabled={invalidEmail}
          style={invalidEmail ? DISABLED_BUTTON_STYLE : null}
        >
          Request Link
        </button>
      </main>
    </>
  );
};

export default ResetPassword;

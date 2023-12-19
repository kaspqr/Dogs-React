import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAddNewUserMutation } from "../user-slices/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";

const NewUserForm = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [country, setCountry] = useState("Argentina");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const USERNAME_REGEX = /^[A-z0-9]{6,20}$/;
  const NAME_REGEX = /^(?=.{1,30}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/;

  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setEmail("");
      setCountry("");
      setRegion("");
      setBio("");
      setSuccessMsg(
        "A verification link has been sent to your email. " +
          "Please check the Spam folder if you cannot find it in your Primary emails. " +
          "You will be able to log in once your account is verified."
      );
    }
  }, [isSuccess, navigate]);

  const canSave =
    [validUsername, validPassword, validName, validEmail].every(Boolean) &&
    password === confirmPassword &&
    !isLoading;

  const handleSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({
        username,
        password,
        name,
        email,
        country,
        region,
        bio,
      });
    }
  };

  if (auth?.username?.length) {
    return (
      <p>
        You are currently logged in. Please logout before registering a new
        user.
      </p>
    );
  }

  if (isLoading) return;

  const content = successMsg?.length ? (
    <p>{successMsg}</p>
  ) : (
    <>
      {isError ? <p>{error?.data?.message}</p> : null}
      <form onSubmit={handleSaveUserClicked}>
        <div>
          <p className="register-page-title">Register New Account</p>
        </div>
        <p>
          Fields marked with <b>*</b> are required
        </p>
        <br />
        <label htmlFor="username">
          <b>Username (6-20 Letters and/or Numbers)*</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="password">
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
        />
        <br />
        <label className="top-spacer" htmlFor="confirm-password">
          <b>Confirm Password*</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="email">
          <b>Email*</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="name">
          <b>Name*</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="country">
          <b>Country*</b>
        </label>
        <br />
        <select
          type="text"
          id="country"
          name="country"
          value={country}
          onChange={(e) => {
            setRegion("");
            setCountry(e.target.value);
          }}
        >
          {COUNTRIES}
        </select>
        <br />
        <label className="top-spacer" htmlFor="region">
          <b>Region</b>
        </label>
        <br />
        <select
          disabled={!BIG_COUNTRIES?.includes(country)}
          name="region"
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="none ">--</option>
          {BIG_COUNTRIES?.includes(country) ? REGIONS[country] : null}
        </select>
        <br />
        <label className="top-spacer" htmlFor="bio">
          <b>Bio</b>
        </label>
        <br />
        <textarea
          className="three-hundred"
          cols="30"
          rows="10"
          maxLength="500"
          name="bio"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <br />
        <br />
      </form>
      <div className="register-page-button-div">
        <button
          onClick={handleSaveUserClicked}
          className="black-button three-hundred"
          title="Register"
          disabled={!canSave}
          style={
            !canSave ? { backgroundColor: "grey", cursor: "default" } : null
          }
        >
          Register
        </button>
      </div>
    </>
  );

  return content;
};

export default NewUserForm;

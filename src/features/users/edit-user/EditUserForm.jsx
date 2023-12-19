import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../user-slices/usersApiSlice";
import { useSendLogoutMutation } from "../../auth/auth-slices/authApiSlice";
import { COUNTRIES } from "../../../config/countries";
import { BIG_COUNTRIES } from "../../../config/bigCountries";
import { REGIONS } from "../../../config/regions";

const EditUserForm = ({ user }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [bio, setBio] = useState(user.bio !== "none " ? user.bio : "");
  const [country, setCountry] = useState(user.country);
  const [region, setRegion] = useState(user.region?.length ? user.region : "");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [previewSource, setPreviewSource] = useState();
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deletionVisible, setDeletionVisible] = useState(false);

  const fileInputRef = useRef(null);

  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteUserMutation();

  const [
    sendLogout,
    {
      isLoading: isLogoutLoading,
      isSuccess: isLogoutSuccess,
      isError: isLogoutError,
      error: logoutError,
    },
  ] = useSendLogoutMutation();

  const NAME_REGEX = /^(?=.{1,30}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const PASSWORD_REGEX = /^[A-z0-9!@#%]{8,20}$/;

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setPassword("");
      setConfirmPassword("");
      setName("");
      setEmail("");
      setCountry("");
      setRegion("");
      setBio("");
      navigate("/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  useEffect(() => {
    if (isLogoutSuccess) navigate("/");
  }, [isLogoutSuccess, navigate]);

  const handleSaveUserClicked = async () => {
    setChangePasswordError("");
    const finalBio = bio?.length ? bio : "none ";

    if (password?.length) {
      if (password !== confirmPassword) {
        setChangePasswordError(
          <>New Password doesn't match with Confirm Password</>
        );
      }
      await updateUser({
        id: user.id,
        password,
        name,
        email,
        country,
        region,
        currentPassword,
        bio: finalBio,
        image: previewSource,
      });
    } else {
      await updateUser({
        id: user.id,
        name,
        email,
        country,
        region,
        currentPassword,
        bio: finalBio,
        image: previewSource,
      });
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  if (isLoading || isDelLoading || isLogoutLoading) return;

  const errContent = isError
    ? error?.data?.message
    : isDelError
    ? delerror?.data?.message
    : isLogoutError
    ? logoutError
    : "";

  const canSave =
    currentPassword?.length &&
    NAME_REGEX.test(name) &&
    email !== user?.email &&
    ((EMAIL_REGEX.test(email) && email === confirmEmail) || !email?.length) &&
    ((!password?.length && !confirmPassword?.length) ||
      (PASSWORD_REGEX.test(password) && password === confirmPassword));

  return (
    <>
      {changePasswordError?.length ? <p>{changePasswordError}</p> : null}
      {errContent?.length ? <p>{errContent}</p> : null}
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <p className="edit-profile-page-title">Edit Profile</p>
        </div>
        <button
          title="Browse Picture"
          onClick={() => fileInputRef.current.click()}
          className="three-hundred black-button top-spacer"
        >
          Browse Picture
        </button>
        <label htmlFor="user-image" className="off-screen">
          Browse Picture
        </label>
        <input
          id="file"
          type="file"
          name="user-image"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files[0];
            previewFile(file);
          }}
          style={{ display: "none" }}
        />
        <br />
        <br />
        {previewSource || (user?.image?.length && user?.image !== "none") ? (
          <>
            <img
              className="user-profile-picture top-spacer"
              height="300px"
              width="300px"
              src={previewSource ? previewSource : user?.image}
              alt="chosen"
            />
            <br />
            <br />
          </>
        ) : (
          <br />
        )}
        <p>
          Fields marked with <b>*</b> are required
        </p>
        <br />

        <label htmlFor="current-password">
          <b>Current Password*</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="password"
          id="current-password"
          name="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="password">
          <b>New Password (8-20 characters, including !@#%)</b>
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
          <b>Confirm New Password</b>
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
          <b>New Email</b>
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
        <label className="top-spacer" htmlFor="confirm-email">
          <b>Confirm New Email</b>
        </label>
        <br />
        <input
          className="three-hundred"
          type="text"
          id="confirm-email"
          name="confirm-email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />
        <br />
        <label className="top-spacer" htmlFor="name">
          <b>Name (Max. 30 Letters)*</b>
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
          <b>Country</b>
        </label>
        <br />
        <select
          type="text"
          id="country"
          name="country"
          value={country}
          onChange={(e) => {
            setRegion("none ");
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
        <div className="edit-profile-buttons-div">
          <button
            className="black-button three-hundred"
            title="Save"
            disabled={!canSave}
            style={
              !canSave ? { backgroundColor: "grey", cursor: "default" } : null
            }
            onClick={handleSaveUserClicked}
          >
            Save
          </button>
          <br />
          <br />
          <button
            title="Delete"
            disabled={!currentPassword?.length}
            style={
              !currentPassword?.length
                ? { backgroundColor: "grey", cursor: "default" }
                : null
            }
            onClick={() => setDeletionVisible(!deletionVisible)}
            className="three-hundred black-button"
          >
            Delete Account
          </button>
          {deletionVisible === false ? null : (
            <>
              <br />
              <br />
              <label htmlFor="confirm-delete">
                <b>
                  Enter your current password on top of the page, type
                  "confirmdelete" in the input below and click on the Confirm
                  Deletion button to delete your account.
                </b>
              </label>
              <br />
              <input
                className="three-hundred"
                name="confirm-delete"
                type="text"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
              />
              <br />
              <br />
              <button
                className="black-button three-hundred"
                title="Confirm Deletion"
                disabled={
                  confirmDelete !== "confirmdelete" || !currentPassword?.length
                }
                style={
                  confirmDelete !== "confirmdelete" || !currentPassword?.length
                    ? { backgroundColor: "grey", cursor: "default" }
                    : null
                }
                onClick={async () => {
                  const response = await deleteUser({
                    id: user.id,
                    currentPassword,
                  });
                  if (!response?.error) sendLogout();
                }}
              >
                Confirm Deletion
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default EditUserForm;

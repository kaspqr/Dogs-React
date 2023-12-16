import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetEmailTokensQuery } from "./auth-slices/emailTokensApiSlice";
import { useGetUsersQuery } from "../users/user-slices/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import { alerts } from "../../components/alerts";

const NewEmail = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[params.id],
    }),
  });

  const {
    data: emailtokens,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetEmailTokensQuery("emailTokensList", {
    pollingInterval: 75000,
    refetchOnMountOrArgChange: true,
  });

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

  if (!user) return <h1>Invalid Link</h1>;
  if (userId?.length) return <h1>Please logout before verifying an account</h1>;
  if (isLoading) alerts.loadingAlert("Looking for tokens");
  if (isError) alerts.errorAlert(error?.data?.message);

  if (isSuccess) {
    Swal.close();

    const { ids, entities } = emailtokens;

    const filteredId = ids.find((tokenId) => {
      return (
        entities[tokenId].emailToken === params?.emailtoken &&
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

export default NewEmail;

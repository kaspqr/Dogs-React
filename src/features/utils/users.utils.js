import { alerts } from "../../components/alerts";

export const filterUsers = ({ users, username, region, country }) => {
  const filteredUsers = username?.length
    ? Object.values(users?.entities)?.filter((user) => {
      return user.username.includes(username);
    })
    : Object.values(users?.entities);

  const filteredRegion = region?.length
    ? filteredUsers?.filter((user) => {
      return user.region === region;
    })
    : filteredUsers;

  const filteredCountry = country?.length
    ? filteredRegion?.filter((user) => {
      return user.country === country;
    })
    : filteredRegion;

  if (!filteredCountry?.length)
    alerts.errorAlert("Unfortunately, no matching user has been found", "Error");

  const filteredIds = filteredCountry?.reverse().map((user) => {
    return user._id;
  });

  return filteredIds
}

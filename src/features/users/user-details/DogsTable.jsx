import UserDog from "../../dogs/dog-components/UserDog";

const DogsTable = ({ ids }) => {
  return (
    <>
      <p>
        <b>
          {ids?.length} Dog{ids?.length === 1 ? null : "s"}{" "}
          Administered
        </b>
      </p>
      <br />
      <br />
      {ids?.map((id) => (
        <UserDog key={id} dogId={id} />
      ))}
      <br />
    </>
  );
};

export default DogsTable;

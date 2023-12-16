import { Link } from "react-router-dom";

const DogSiblings = ({ parentLitter, dog, dogIds, dogEntities }) => {
  const filteredSiblingIds = dogIds?.filter(
    (dogId) =>
      dog?.litter?.length &&
      dogEntities[dogId].litter === dog?.litter &&
      dogId !== dog?.id
  );

  const siblings = filteredSiblingIds?.map((dogId) => dogEntities[dogId]);

  if (!siblings?.length) {
    if (!parentLitter) return;
    return (
      <>
        <p>
          {dog?.name} is not connected to any siblings through it's litter in
          the database
        </p>
        <br />
      </>
    );
  }

  return (
    <>
      {siblings.map((sibling) => (
        <p>
          <b>{sibling?.female === true ? <>Sister </> : <>Brother </>}</b>
          <Link className="orange-link" to={`/dogs/${sibling?.id}`}>
            <b>{sibling?.name}</b>
          </Link>
        </p>
      ))}
      <br />
    </>
  );
};

export default DogSiblings;

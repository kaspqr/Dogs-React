import { alerts } from "../../components/alerts";

export const filterDogs = ({
  dogs,
  bornEarliest,
  bornLatest,
  name,
  chipnumber,
  region,
  country,
  breed,
  gender,
  chipped,
  passport,
  fixed,
  heat
}) => {
  const finalBornEarliest = bornEarliest !== "" ? new Date(bornEarliest) : "";

  const filteredDogsBornEarliest =
    finalBornEarliest !== ""
      ? Object.values(dogs?.entities)?.filter((dog) => {
        return new Date(dog.birth) >= finalBornEarliest;
      })
      : Object.values(dogs?.entities);

  const finalBornLatest = bornLatest !== "" ? new Date(bornLatest) : "";

  const filteredDogsBornLatest =
    finalBornLatest !== ""
      ? filteredDogsBornEarliest?.filter((dog) => {
        return new Date(dog.birth) <= finalBornLatest;
      })
      : filteredDogsBornEarliest;

  const filteredDogsName = name?.length
    ? filteredDogsBornLatest?.filter((dog) => {
      return dog.name?.includes(name);
    })
    : filteredDogsBornLatest;

  const filteredDogsChipnumber = chipnumber?.length
    ? filteredDogsName?.filter((dog) => {
      return dog.chipnumber === chipnumber;
    })
    : filteredDogsName;

  const filteredDogsRegion = region?.length
    ? filteredDogsChipnumber?.filter((dog) => {
      return dog.region === region;
    })
    : filteredDogsChipnumber;

  const filteredDogsCountry = country?.length
    ? filteredDogsRegion?.filter((dog) => {
      return dog.country === country;
    })
    : filteredDogsRegion;

  const filteredDogsBreed = breed?.length
    ? filteredDogsCountry?.filter((dog) => {
      return dog.breed === breed;
    })
    : filteredDogsCountry;

  const filteredDogsGender = gender?.length
    ? filteredDogsBreed?.filter((dog) => {
      if (gender === "female") {
        return dog.female === true;
      } else {
        return dog.female === false;
      }
    })
    : filteredDogsBreed;

  const filteredDogsChipped = chipped?.length
    ? filteredDogsGender?.filter((dog) => {
      if (chipped === "yes") {
        return dog.microchipped === true;
      } else {
        return dog.microchipped === false;
      }
    })
    : filteredDogsGender;

  const filteredDogsPassport = passport?.length
    ? filteredDogsChipped?.filter((dog) => {
      if (passport === "yes") {
        return dog.passport === true;
      } else {
        return dog.passport === false;
      }
    })
    : filteredDogsChipped;

  const filteredDogsFixed = fixed?.length
    ? filteredDogsPassport?.filter((dog) => {
      if (fixed === "yes") {
        return dog.sterilized === true;
      } else {
        return dog.sterilized === false;
      }
    })
    : filteredDogsPassport;

  const filteredDogsHeat = heat?.length
    ? filteredDogsFixed?.filter((dog) => {
      if (heat === "yes") {
        return dog.heat === true;
      } else {
        return dog.heat === false;
      }
    })
    : filteredDogsFixed;

  const finalFilteredDogs = filteredDogsHeat;

  if (!finalFilteredDogs?.length)
    alerts.errorAlert("Unfortunately, no matching dog has been found", "Error");

  const filteredIds = finalFilteredDogs?.reverse().map((dog) => {
    return dog._id;
  });

  return filteredIds
}

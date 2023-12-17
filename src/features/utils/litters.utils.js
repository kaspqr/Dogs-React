import { alerts } from "../../components/alerts";

export const filterLitters = ({ litters, bornEarliest, bornLatest, region, country, lowestPuppies, breed, highestPuppies }) => {
  if (
    lowestPuppies?.length &&
    highestPuppies?.length &&
    highestPuppies < lowestPuppies
  ) {
    alerts.errorAlert(
      "Highest amount of puppies cannot be lower than lowest amount of puppies",
      "Error"
    );
    return
  }

  const finalBornEarliest = bornEarliest !== "" ? new Date(bornEarliest) : "";

  const filteredLittersBornEarliest =
    finalBornEarliest !== ""
      ? Object.values(litters?.entities)?.filter((litter) => {
        return new Date(litter.born) >= finalBornEarliest;
      })
      : Object.values(litters?.entities);

  const finalBornLatest = bornLatest !== "" ? new Date(bornLatest) : "";

  const filteredLittersBornLatest =
    finalBornLatest !== ""
      ? filteredLittersBornEarliest?.filter((litter) => {
        return new Date(litter.born) <= finalBornLatest;
      })
      : filteredLittersBornEarliest;

  const filteredLittersRegion = region?.length
    ? filteredLittersBornLatest?.filter((litter) => {
      return litter.region === region;
    })
    : filteredLittersBornLatest;

  const filteredLittersCountry = country?.length
    ? filteredLittersRegion?.filter((litter) => {
      return litter.country === country;
    })
    : filteredLittersRegion;

  const filteredLittersLowestPuppies = lowestPuppies?.length
    ? filteredLittersCountry?.filter((litter) => {
      return litter.children >= parseInt(lowestPuppies);
    })
    : filteredLittersCountry;

  const filteredLittersBreed = breed?.length
    ? filteredLittersLowestPuppies?.filter((litter) => {
      return litter.breed === breed;
    })
    : filteredLittersLowestPuppies;

  const filteredLittersHighestPuppies = highestPuppies?.length
    ? filteredLittersBreed?.filter((litter) => {
      return litter.children <= parseInt(highestPuppies);
    })
    : filteredLittersBreed;

  const finalFilteredLitters = filteredLittersHighestPuppies;

  if (!finalFilteredLitters?.length)
    alerts.errorAlert("Unfortunately, no matching litter has been found", "Error");

  const filteredIds = finalFilteredLitters?.reverse().map((litter) => {
    return litter._id;
  });

  return filteredIds
}
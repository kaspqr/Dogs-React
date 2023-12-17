import { alerts } from "../../components/alerts";

export const filterAdvertisements = ({
  advertisements,
  title,
  region,
  country,
  type,
  breed,
  currency,
  lowestPrice,
  highestPrice,
  sort
}) => {
  const filteredAdsTitle = Object.values(advertisements?.entities)?.filter(
    (ad) => {
      return ad.title?.includes(title);
    }
  );

  const filteredAdsRegion = region?.length
    ? filteredAdsTitle?.filter((ad) => {
      return ad.region === region;
    })
    : filteredAdsTitle;

  const filteredAdsCountry = country?.length
    ? filteredAdsRegion?.filter((ad) => {
      return ad.country === country;
    })
    : filteredAdsRegion;

  const filteredAdsType = type?.length
    ? filteredAdsCountry?.filter((ad) => {
      return ad.type === type;
    })
    : filteredAdsCountry;

  const filteredAdsBreed = breed?.length
    ? filteredAdsType?.filter((ad) => {
      return ad.breed === breed;
    })
    : filteredAdsType;

  const filteredAdsCurrency = currency?.length
    ? filteredAdsBreed?.filter((ad) => {
      return ad.currency === currency;
    })
    : filteredAdsBreed;

  const filteredAdsLowestPrice = lowestPrice?.length
    ? filteredAdsCurrency?.filter((ad) => {
      return ad.price >= parseInt(lowestPrice);
    })
    : filteredAdsCurrency;

  const filteredAdsHighestPrice = highestPrice?.length
    ? filteredAdsLowestPrice?.filter((ad) => {
      return ad.price <= parseInt(highestPrice);
    })
    : filteredAdsLowestPrice;

  const finalFilteredAds = !sort?.length
    ? filteredAdsHighestPrice
    : sort === "ascending"
      ? filteredAdsHighestPrice.sort((a, b) => b.price - a.price)
      : sort === "descending"
        ? filteredAdsHighestPrice.sort((a, b) => a.price - b.price)
        : filteredAdsHighestPrice;

  if (!finalFilteredAds?.length)
    alerts.errorAlert("Unfortunately, no matching advertisement has been found", "Error");

  const filteredIds = finalFilteredAds?.reverse().map((ad) => {
    return ad._id;
  });

  return filteredIds
}

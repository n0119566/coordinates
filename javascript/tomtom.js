/**
 * Calls TomTom API and returns an array of POI locations
 * @param {Latitude} lat
 * @param {Longitude} long
 * @param {Type of search, either gas or POI} searchType
 */
async function getLocations(lat, long, searchType) {
  const addressByCoordSearch = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${long}.json?key=${apiKey}&radius=100`;
  const gasStationByCoordSearch = `https://api.tomtom.com/search/2/categorySearch/gas.json?lat=${lat}&lon=${long}&radius=100&view=Unified&relatedPois=all&key=${apiKey}`;
  const nearBySearch = `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${lat}&lon=${long}&radius=100&view=Unified&relatedPois=all&key=${apiKey}`;
  let locationAddress;
  let locationName;
  // Default to gas station search
  let searchQuery = gasStationByCoordSearch;
  let poiList = [];

  // See if we are searching for just POIs
  if (searchType === POI_SEARCH) {
    searchQuery = nearBySearch;
  }

  try {
    const response = await fetch(searchQuery);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Get an array of results from the response, should only be 1
    result = data.results;

    // Go through the results, create a new POI object for each and add it to the list
    for (let i = 0; i < result.length; i++) {
      let newPoi = new Poi();
      newPoi.name = result[i].poi.name;
      newPoi.address = result[i].address.freeformAddress;
      newPoi.category = result[i].poi.categories[0];
      poiList.push(newPoi);
    }

    return poiList;
  } catch (error) {
    console.error(error);
    return null;
  }
}
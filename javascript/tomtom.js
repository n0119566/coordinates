/**
 * Calls TomTom API and returns an array of POI locations
 * @param {Latitude} lat
 * @param {Longitude} long
 * @param {Type of search, either gas or POI} searchType
 */
async function getLocations(lat, long, searchType) {
  const gasStationByCoordSearch = `https://api.tomtom.com/search/2/categorySearch/gas.json?lat=${lat}&lon=${long}&radius=100&view=Unified&relatedPois=all&key=${apiKey}`;
  const nearBySearch = `https://api.tomtom.com/search/2/nearbySearch/.json?lat=${lat}&lon=${long}&limit=50&radius=1000&view=Unified&relatedPois=all&key=${apiKey}`;
  // lat = 47.433336837342154;
  // long = -122.29741803626762;

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

    // Get an array of results from the response
    result = data.results;

    // Go through the results, create a new POI object for each and add it to the list
    for (let i = 0; i < result.length; i++) {
      let newPoi = new Poi();
      newPoi.name = result[i].poi.name;
      newPoi.address = result[i].address.freeformAddress;
      newPoi.category = result[i].poi.categories[0];
      newPoi.distanceInFeet = result[i].dist;
      poiList.push(newPoi);
    }

    return poiList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Get the current address
async function getCurrentAddress(lat, long) {
  const addressByCoordSearch = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${long}.json?key=${apiKey}&radius=100`;
  try {
    const response = await fetch(addressByCoordSearch);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Get an array of results from the response, should only be 1
    const result = data.addresses;
    let address = "";
    if (result.length > 0) {
      address = result[0].address.freeformAddress;
    }

    return address;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Get the coordinates for a search string, e.g., City and State
async function getCoordinates(searchString) {
  const searchTerm = encodeURIComponent(searchString);
  const coordSearch = `https://api.tomtom.com/search/2/geocode/${searchTerm}.json?storeResult=false&countrySet=us&view=Unified&key=${apiKey}`;
  try {
    const response = await fetch(coordSearch);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Get an array of results from the response, should only be 1
    return {latitude: data.results[0].position.lat, longitude: data.results[0].position.lon, address: data.results[0].address.freeformAddress};
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Define a POI object
class Poi {
  constructor() {
    this.name = "";
    this.address = "";
    this.category = "";
    this.distance = "";
  }
  // takes in distance in meters and converts to feet or miles
  set distanceInFeet(meters) {
    // Convert meters to feet.
    let distanceInFeet = Math.floor(meters * 3.28084);

    // If its more than .1 of a mile, display as miles otherwise feet.
    if (distanceInFeet < 528) {
      this.distance = distanceInFeet + "ft";
    } else {
      // Converts meetings to miles
      this.distance = (meters / 1609).toFixed(2) + "mi";
    }
  }
}



const getGasButton = document.querySelector("#getGas");
const getPOIButton = document.querySelector("#getPOIs");
const locationInput = document.querySelector("#location");
const verboseLocation = document.querySelector("#verboseLocation");
const GAS_STATION_SEARCH = "gas";
const POI_SEARCH = "poi";
const poiTable = document.querySelector("#poiTable");
const clearButton = document.querySelector("#clear");
const coordsButton = document.querySelector("#coords");
const headers = ["Name", "Address", "Business Type", "Distance"];
let browserLong = "";
let browserLat = "";
const apiKey = "Mkqt0JQXx0JlI2QILMry1yA7SF3tppae";
const currentLocationButton = document.querySelector("#getYourLocation");

/**
 * Gets current browser location and populates the search field
 */
currentLocationButton.addEventListener("click", async () => {
  clearPOItable();
  await getBrowserLocation();
});

// Event listeners - route and perform search based on button
getGasButton.addEventListener("click", () => {
  getLocationAndUpdateUI(GAS_STATION_SEARCH);
});
getPOIButton.addEventListener("click", () => {
  getLocationAndUpdateUI(POI_SEARCH);
});

clearButton.addEventListener("click", () => {
  locationInput.value = "";
  verboseLocation.textContent = "";
  clearPOItable();
});

async function getLocationAndUpdateUI(searchType) {
  // Get the coordinates and the formatted  address for the input field
  let coordinates = await getCoordinates(locationInput.value);
  verboseLocation.textContent = coordinates.address;
  locationInput.value = coordinates.address;

  // Call the API and expect to get a location or locations back as array of POIs
  let locations = await getLocations(
    coordinates.latitude,
    coordinates.longitude,
    searchType
  );

  // If we only get back 1 result, print it out
  if (locations.length === 0) {
    verboseLocation.textContent =
      verboseLocation.textContent + " - Nothing found at this address";

    // We do this just in case we've already round something, try again and find nothing
    clearPOItable();
  } else {
    // See if it has part of "nothing found" - if it does, we'll remove that part leaving just address
    // TODO: Using a - to splice out the text doesnt work since some addresses have "-" - need better solution
    if (verboseLocation.textContent.includes("Nothing")) {
      verboseLocation.textContent = verboseLocation.textContent
        .substring(0, verboseLocation.textContent.indexOf("-"))
        .trim();
    }
    buildPOITable(locations);
  }
}

/**
 * When working with tables, you have to build them backwards
 * Append a td to a tr, a tr to a body, etc
 * @param {*} pois
 */
function buildPOITable(pois) {
  // Clear the POI table
  clearPOItable();

  // Create header
  const thead = document.createElement("thead");
  thead.className = "thead-dark";
  const tr = document.createElement("tr");

  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement("th");
    th.textContent = headers[i];
    th.scope = "col";
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  poiTable.appendChild(thead);

  // Create the body and populate it
  const tbody = document.createElement("tbody");

  for (let i = 0; i < pois.length; i++) {
    // To add a new column - create a TD for the value, assign the value, append it
    const tr = document.createElement("tr");
    const name = document.createElement("td");
    const address = document.createElement("td");
    const category = document.createElement("td");
    const distance = document.createElement("td");
    name.textContent = pois[i].name;
    address.textContent = pois[i].address;
    category.textContent = pois[i].category;
    distance.textContent = pois[i].distance;
    tr.appendChild(name);
    tr.appendChild(address);
    tr.appendChild(category);
    tr.appendChild(distance);
    tbody.appendChild(tr);
  }

  // Add the rows to the table
  poiTable.appendChild(tbody);
}

// Clear table results
function clearPOItable() {
  let element = document.getElementById("poiTable");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Fires when DOM has been loaded - we use it to get the current city and state and pre-populate the search field
 */
window.addEventListener("DOMContentLoaded", (event) => {
  getBrowserLocation();
});

async function getBrowserLocation() {
  navigator.geolocation.getCurrentPosition(async function (position) {
    browserLat = position.coords.latitude;
    browserLong = position.coords.longitude;

    // Get the address for the coords
    const address = await getCurrentAddress(browserLat, browserLong);

    // Display it in the input field as a starting point and also in the text
    verboseLocation.textContent = `Current location: ${address}`;
    locationInput.value = address;
  });
}

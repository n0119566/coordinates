const getLocationButton = document.querySelector("#getLocation");
const getPOIButton = document.querySelector("#getPOIs");
const latitudeInput = document.querySelector("#latitude");
const longitudeInput = document.querySelector("#longitude");
const verboseLocation = document.querySelector("#verboseLocation");
const GAS_STATION_SEARCH = "gas";
const POI_SEARCH = "poi";
const poiList = document.querySelector("#poiList");
const poiTable = document.querySelector("#poiTable");
const clearButton = document.querySelector("#clear");
const headers = ["Name", "Address", "Business Type", "Distance"];
//const apiKey = "Mkqt0JQXx0JlI2QILMry1yA7SF3tppae";

// Event listeners - route and perform search based on button
getLocationButton.addEventListener("click", () => {
  getLocationAndUpdateUI(GAS_STATION_SEARCH);
});
getPOIButton.addEventListener("click", () => {
  getLocationAndUpdateUI(POI_SEARCH);
});

clearButton.addEventListener("click", () => {
  latitudeInput.value = "";
  longitudeInput.value = "";
  verboseLocation.textContent = "";
  clearPOItable();
});

async function getLocationAndUpdateUI(searchType) {
  if (latitudeInput.value === "" || longitudeInput.value === "") {
    let coords = await getCoordinates();
    console.log(coords);
  }

  console.log("second");
  const lat = latitudeInput.value;
  const long = longitudeInput.value;

  // Call the API and expect to get a location or locations back as array of POIs
  let locations = await getLocations(lat, long, searchType);

  // If we only get back 1 result, print it out
  if (locations.length === 0) {
    verboseLocation.textContent = "Nothing found at this location";

    // We do this just in case we've already round something, try again and find nothing
    clearPOItable();
  } else {
    // We do this in case we search previously and found nothing but found something this time
    verboseLocation.textContent = "";
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

// Build the list of POIs and add it to the HTML
function buildPOIList(pois) {
  clearPOI();
  verboseLocation.textContent =
    "POIs at this Location" || "Unable to get location";
  // For each roll, create a list item, add the roll text, and push it to the list.
  for (let i = 0; i < pois.length; i++) {
    const li = document.createElement("li");

    // Set the value to display
    li.innerText = `${pois[i].name} - ${pois[i].address} - ${pois[i].category}`;

    // Add some style via Bootstrap
    li.classList = "list-group-item";
    poiList.append(li);
  }
}

// Clear the POI list
function clearPOI() {
  const listItems = poiList.getElementsByTagName("li");

  // Need to count down since you are removing items
  let i = listItems.length - 1;
  while (i >= 0) {
    const listItem = listItems[i];
    listItem.remove();
    i--;
  }
  verboseLocation.textContent = "";
}

// Clear table results
function clearPOItable() {
  let element = document.getElementById("poiTable");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

async function getCoordinates() {
  let coords = await navigator.geolocation.getCurrentPosition(
    async function (position) {
      const latitude = await position.coords.latitude;
      const longitude = await position.coords.longitude;

      // Add them to input fields
      latitudeInput.value = latitude;
      longitudeInput.value = longitude;
      console.log("first");
      return "";  
    }
    
  );
  return coords;
}

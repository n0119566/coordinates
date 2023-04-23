const coordsButton = document.querySelector("#coords");
const latDisplay = document.querySelector("#lat");
const longDisplay = document.querySelector("#long");
const copyButton = document.querySelector("#copy");
const copyConfirmation = document.querySelector("#copyConfirm");


coordsButton.addEventListener("click", function () {
  // Get the postion from the browser
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Display them in the browser
    latDisplay.textContent = `Latitude: ${latitude} `;
    longDisplay.textContent = `Longitude: ${longitude}`;

    // Unhide the copy button
    copyButton.classList.remove("d-none");
  });
});

// Copy long and lat to the clipboard to make life easy
copyButton.addEventListener("click", () => {
  const lat = latDisplay.textContent;
  const long = longDisplay.textContent;

  // Make sure we have long and length and copy
  if (lat.length > 0 && long.length > 0) {
    const copyText = lat + " " + long;
    navigator.clipboard.writeText(copyText);
    copyConfirmation.textContent = "Coordinates Copied...";
  }
});

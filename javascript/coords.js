const coordsButton = document.querySelector("#coords");
const latDisplay = document.querySelector("#lat");
const longDisplay = document.querySelector("#long");

coordsButton.addEventListener("click", function () {
  // Get the postion from the browser
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Display them in the browser
    latDisplay.textContent = `Latitude: ${latitude} `;
    longDisplay.textContent = `Longitude: ${longitude}`;
  });
});

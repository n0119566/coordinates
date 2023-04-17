const coordsButton = document.querySelector("#coords");
const coordsDisplay = document.querySelector("#display");

coordsButton.addEventListener("click", function(){

  // Get the postion from the browser
  navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    coordsDisplay.textContent = `Latitude: ${latitude} Longitude: ${longitude}`;

  });
});
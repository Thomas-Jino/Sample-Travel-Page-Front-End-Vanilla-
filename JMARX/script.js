/**
 * Main function to trigger the location lookup process.
 */
function getUserLocationAndAddress() {
  // 1. Check browser compatibility
  if (!navigator.geolocation) {
    updateStatus("Geolocation is not supported by your browser.");
    return;
  }

  updateStatus("Requesting location permission...");

  // 2. Fetch GPS coordinates
  navigator.geolocation.getCurrentPosition(
    handleSuccess, 
    handleError, 
    {
      enableHighAccuracy: true, // Request best possible accuracy (GPS)
      timeout: 10000,           // Wait up to 10 seconds
      maximumAge: 0             // Do not use a cached position
    }
  );
}

/**
 * Runs automatically when the user grants permission and coordinates are found.
 */
async function handleSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  updateStatus(`Coordinates found: ${lat.toFixed(4)}, ${lon.toFixed(4)}. Fetching address...`);

  // 3. Convert coordinates to a readable address
  const address = await reverseGeocode(lat, lon);

  if (address) {
    updateStatus(`Success! Address found.`);
    displayResult(lat, lon, address);
  } else {
    updateStatus("Coordinates found, but failed to retrieve address.");
  }
}

/**
 * Contacts the Nominatim API to perform the reverse geocode lookup.
 */
async function reverseGeocode(lat, lon) {
  // Nominatim rules require a valid User-Agent identifying your application
  const appName = "MyWeatherApp/1.0"; 
  const url = `https://openstreetmap.org{lat}&lon=${lon}&format=json`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': appName }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the full address block string
    return data.display_name; 
  } catch (error) {
    console.error("Geocoding fetch failed:", error);
    return null;
  }
}

/**
 * Runs automatically if the user denies permission or the GPS fails.
 */
function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      updateStatus("Error: Permission denied. Please allow location access in your browser.");
      break;
    case error.POSITION_UNAVAILABLE:
      updateStatus("Error: Location information unavailable from your device hardware.");
      break;
    case error.TIMEOUT:
      updateStatus("Error: Location request timed out.");
      break;
    default:
      updateStatus("Error: An unknown error occurred while fetching coordinates.");
      break;
  }
}

/**
 * UI Helper: Simple logging to track the application workflow.
 */
function updateStatus(message) {
  console.log(`[Status]: ${message}`);
}

/**
 * UI Helper: Final output handling.
 */
function displayResult(lat, lon, address) {
  console.log("--- FINAL LOCATION DATA ---");
  console.log(`Latitude:  ${lat}`);
  console.log(`Longitude: ${lon}`);
  console.log(`Address:   ${address}`);
}

// Execute the program
getUserLocationAndAddress();


const discoverBtn = document.getElementById('discover');
const placesSection = document.getElementById('places');

discoverBtn.addEventListener('click', () => {
  placesSection.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
});

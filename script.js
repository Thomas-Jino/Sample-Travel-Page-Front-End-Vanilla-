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


// UI Actions


// Elements
const discoverBtn = document.getElementById('discover');
const placesSection = document.getElementById('places');
const hamburger = document.getElementById('hamburger');
const hamburgerImg = document.getElementById('hamburger-img');
const util = document.getElementById('util');
const close = document.getElementById('close');
const dropBtns = document.querySelectorAll('.dropbtn');
const SignIn = document.getElementById('signin-btn');
const SignPOP = document.getElementById('SignPOP');
const closeSign = document.getElementById('close-sign');
const crpeye = document.getElementById('crpeye');
const copeye = document.getElementById('copeye');
const crpin = document.getElementById('crpin');
const copin = document.getElementById('copin');


const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

// Discover Button Animation

discoverBtn.addEventListener('click', () => {
  placesSection.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
});

let acstat = '0';


// Hamburger

let hstate = 'closed';

hamburger.addEventListener('click', () => {
  // Toggle the master class on the header
  header.classList.toggle('mobile-active');
  
  if (header.classList.contains('mobile-active')) {
    hamburgerImg.src = 'assets/images/close.png';
    hstate = 'open'; // Preserved your state logic
    header.style.backgroundColor = '#fff';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  } else {
    hamburgerImg.src = 'assets/images/hamburger.png';
    hstate = 'closed'; // Preserved your state logic
    header.style.backgroundColor = '#64DA8E'; // Removed the space from your hex code
    document.body.style.overflow = ''; // Restore scrolling
    
    // Cleanup: Close any open submenus when the main menu closes
    document.querySelectorAll('.dropdown-content.show-mobile').forEach(content => {
        content.classList.remove('show-mobile');
    });
  }
  
  // Preserved your console logic
  if (util && (util.style.display === '' || util.style.display === 'none')) {
    console.log('Opening menu');
  }
});

// Dropdown Accordion Logic for Mobile
dropBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Only run this logic if we are in mobile view
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Stop the 'href='#' from jumping the page to the top
            
            // Find the immediate dropdown-content sibling next to the clicked button
            const content = btn.nextElementSibling;
            
            // Toggle visibility class
            content.classList.toggle('show-mobile');
        }
    });
});

// Sign In Button

SignPOP.style.display = 'none'; // Ensure the sign-in popup is hidden on page load

SignIn.addEventListener('click', () => {
  SignPOP.style.display = 'flex';
  header.style.filter = 'blur(2px)';
  main.style.filter = 'blur(2px)';
  footer.style.filter = 'blue(2px)';
});

closeSign.addEventListener('click', () => {
  SignPOP.style.display = 'none';
  header.style.filter = 'none';
  main.style.filter = 'none';
  footer.style.filter = 'none';
});

crpeye.addEventListener('click', () => {
  if (crpin.type === "password"){
    crpin.type = "text";
    crpeye.src = "assets/images/crossedeye.png";
  }else {
    crpin.type = "password";
    crpeye.src = "assets/images/eye.png";
  }
});

copeye.addEventListener('click', () => {
  if (copin.type === "password"){
    copin.type = "text";
    copeye.src = "assets/images/crossedeye.png";
  }else {
    copin.type = "password";
    copeye.src = "assets/images/eye.png";
  }  
});


// Trips Menu

const Mytrips = document.getElementById("MyTrips");
const openTrip = document.getElementById("Tripsbtn");
const closeTrip = document.getElementById("close-trips");

const tripsData = [
    {
        title: "Amalfi Coast, Italy",
        description: "Cliffside suites, private yacht experiences, and Michelin-star dining along Italy’s most iconic coastline.",
        tags: "Luxury Stay · Private Tours · Fine Dining",
        image: "assets/images/italy.png"
    },
    {
        title: "Dubai, UAE",
        description: "An indulgent blend of modern luxury, desert adventures, and world-class wellness experiences.",
        tags: "Premium Resort · Spa Retreat · Exclusive Access",
        image: "assets/images/dubai.png"
    },
    {
        title: "Maldives",
        description: "Overwater villas, crystal-clear lagoons, and personalized experiences designed for complete relaxation",
        tags: "Private Villa · Ocean View · Honeymoon Favorite",
        image: "assets/images/maldives.png"
    }
];

const container = document.getElementById('pcomponent');
const template = document.getElementById('trip-card-template');

tripsData.forEach(trip => {
    // Clone the nested template
    const cardClone = template.content.cloneNode(true);
    
    // Bind textual data
    cardClone.querySelector('.trip-title').textContent = trip.title;
    cardClone.querySelector('.trip-description').textContent = trip.description;
    cardClone.querySelector('.trip-tags').textContent = trip.tags;
    
    // Bind background image dynamically
    const banner = cardClone.querySelector('.trip-card-banner');
    banner.style.backgroundImage = `url('${trip.image}')`;
    
    // Inject straight into the active display wrapper
    container.appendChild(cardClone);
});

openTrip.addEventListener('click', () => {
  Mytrips.classList.add('active');
  Mytrips.style.display = 'flex';
});

closeTrip.addEventListener('click', () => {
  Mytrips.classList.remove('active');
  Mytrips.style.display = 'none';
});
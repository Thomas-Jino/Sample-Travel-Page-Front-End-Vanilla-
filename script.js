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

  updateStatus(`Coordinates found: ${lat.toFixed(4)}, ${lon.toFixed(4)}. Fetching location name...`);

  // 3. Convert coordinates to a clean place name (e.g., Thiruvananthapuram)
  const address = await reverseGeocode(lat, lon);

  if (address) {
    updateStatus(`Success! Location identified.`);
    displayResult(lat, lon, address);
  } else {
    updateStatus("Coordinates found, but failed to retrieve location name.");
  }
}

/**
 * Contacts the Nominatim API and extracts ONLY the specific region/city name.
 */
async function reverseGeocode(lat, lon) {
  // Nominatim rules require a valid User-Agent identifying your application
  const appName = "MyWeatherApp/1.0"; 
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': appName }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the nested 'address' object dictionary
    const addressDetails = data.address || {};
    
    // Target city, falling back to county or state_district depending on regional tagging
    const cleanPlace = addressDetails.city || addressDetails.county || addressDetails.state_district || "Unknown Location";
    
    return cleanPlace; 
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
  console.log(`Place:     ${address}`); // Prints clean name directly
  document.getElementById("location_input").value = `${address}`;
}

// Execute the program
getUserLocationAndAddress();


// ==========================================
// UI Actions & Interactivity
// ==========================================

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

// Translation specific elements
const langBtn = document.getElementById('lang-btn');
const translateBanner = document.getElementById('translate-banner'); 
const closeTranslate = document.getElementById('close-translate');   


const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

// Translate Toggle (Opens the banner)
langBtn.addEventListener('click', () => {
    if (translateBanner.style.display === 'none' || translateBanner.style.display === '') {
        translateBanner.style.display = 'flex'; 
    } else {
        translateBanner.style.display = 'none';
    }
});

// Close Button Logic (Hides the banner)
closeTranslate.addEventListener('click', () => {
    translateBanner.style.display = 'none';
});


// Discover Button Animation
discoverBtn.addEventListener('click', () => {
  placesSection.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
});

let acstat = '0';


// Hamburger Menu UI Logic
let hstate = 'closed';

hamburger.addEventListener('click', () => {
  header.classList.toggle('mobile-active');
  
  if (header.classList.contains('mobile-active')) {
    hamburgerImg.src = 'assets/images/close.png';
    hstate = 'open'; 
    header.style.backgroundColor = '#fff';
    document.body.style.overflow = 'hidden'; 
  } else {
    hamburgerImg.src = 'assets/images/hamburger.png';
    hstate = 'closed'; 
    header.style.backgroundColor = '#64DA8E'; 
    document.body.style.overflow = ''; 
    
    // Cleanup: Close any open submenus when the main menu closes
    document.querySelectorAll('.dropdown-content.show-mobile').forEach(content => {
        content.classList.remove('show-mobile');
    });
  }
  
  if (util && (util.style.display === '' || util.style.display === 'none')) {
    console.log('Opening menu');
  }
});

// Dropdown Accordion Logic for Mobile
dropBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault(); 
            const content = btn.nextElementSibling;
            content.classList.toggle('show-mobile');
        }
    });
});

// Sign In Modal Window Toggle
SignPOP.style.display = 'none'; 

SignIn.addEventListener('click', () => {
  SignPOP.style.display = 'flex';
  header.style.filter = 'blur(2px)';
  main.style.filter = 'blur(2px)';
  footer.style.filter = 'blur(2px)';
  Mytrips.style.filter = 'blur(2px)';
  document.querySelector('body').style.overflowY = 'hidden';
});

closeSign.addEventListener('click', () => {
  SignPOP.style.display = 'none';
  header.style.filter = 'none';
  main.style.filter = 'none';
  footer.style.filter = 'none';
  Mytrips.style.filter = 'none';
  document.querySelector('body').style.overflowY = 'auto';
});

// Password Toggle Functionality
crpeye.addEventListener('click', () => {
  if (crpin.type === "password"){
    crpin.type = "text";
    crpeye.src = "assets/images/crossedeye.png";
  } else {
    crpin.type = "password";
    crpeye.src = "assets/images/eye.png";
  }
});

copeye.addEventListener('click', () => {
  if (copin.type === "password"){
    copin.type = "text";
    copeye.src = "assets/images/crossedeye.png";
  } else {
    copin.type = "password";
    copeye.src = "assets/images/eye.png";
  }  
});

//=====================================\\
// --- SIGN-UP Backend Integration --- \\\
/* ------------------------------------ */

async function SignUp() {
  const Email = document.getElementById("email").value;
  const crpass = crpin.value;
  const copass = copin.value;

  if (crpass !== copass) {
    alert("Error: Passwords do not match!");
    return;
  }

  const newUser = {
    email: Email,
    password: crpass
  };

  updateStatus("Sending registration details to server...");

  try {
    const response = await fetch('http://127.0.0.1:8000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();

    if (response.ok) {
      updateStatus("Registration Successful!");
      alert(`Welcome aboard! ${data.message || 'Account created successfully.'}`);
      
      SignPOP.style.display = 'none';
      document.querySelector('body').style.overflowY = 'auto';
    } else {
      updateStatus(`Registration failed: ${data.detail || 'Unknown error'}`);
      alert(`Sign up failed: ${data.detail || 'Please check your inputs.'}`);
    }

  } catch (error) {
    console.error("Network Error during sign up:", error);
    updateStatus("Error: Unable to connect to the authentication server.");
    alert("Could not reach the server. Is your backend running?");
  }
}

// FIXED: Removed the parentheses () so the function only fires when clicked
document.getElementById("signbtn").onclick = SignUp;

// ==========================================
// Dynamic Travel Portfolio / Cards Data Setup
// ==========================================

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

// Programmatically render portfolio cards from standard data objects
tripsData.forEach(trip => {
    const cardClone = template.content.cloneNode(true);
    
    cardClone.querySelector('.trip-title').textContent = trip.title;
    cardClone.querySelector('.trip-description').textContent = trip.description;
    cardClone.querySelector('.trip-tags').textContent = trip.tags;
    
    const banner = cardClone.querySelector('.trip-card-banner');
    banner.style.backgroundImage = `url('${trip.image}')`;
    
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
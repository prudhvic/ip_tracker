import { countries } from "./codes.js";
let domain = document.querySelector("#domain");
let main = document.querySelector("main");
let btn = document.querySelector("#fetch");
let container;
let map;
let marker;

async function fetchIp(domainName = "geo.ipify.org") {
  document.querySelectorAll(".details").forEach((el) => el.remove());
  container = document.createElement("div");
  container.setAttribute("class", "details");
  main.insertBefore(container, document.querySelector("#map"));
  try {
    btn.innerText = "Fetching...";
    let apiKey = "at_XPDMzJMqrNIGJ1bwqVvmcScNJouN6";
    let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&domain=${domainName}`;
    let response = await fetch(url);
    console.log(response);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data (${response.status} ${response.statusText})`
      );
    }

    let data = await response.json();
    console.log(data);
    btn.innerText = "Fetch";
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    container.innerText = "Error fetching data";
    return null;
  }
}

function getCountryName(code) {
  let country = countries.find((country) => country.code === code);
  return country ? country.name : "Unknown";
}

async function display() {
  if (container) {
    container.innerHTML = "";
  }
  let response = await fetchIp(domain.value);

  if (!response) {
    return;
  }
  let ip = document.createElement("p");
  ip.innerText = `IP Address: ${response.ip}`;
  container.append(ip);
  let location = document.createElement("p");
  location.innerText = `Country: ${getCountryName(response.location.country)}`;
  container.append(location);

  let region = document.createElement("p");
  region.innerText = `Region: ${response.location.region}`;
  container.append(region);

  let city = document.createElement("p");
  city.innerText = `City: ${response.location.city}`;
  container.append(city);

  // Initialize Leaflet map if it's not already initialized
  if (!map) {
    map = L.map("map").setView(
      [response.location.lat, response.location.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 50,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([response.location.lat, response.location.lng]).addTo(map);
  map.setView([response.location.lat, response.location.lng], 13);
  domain.value = "";
}

btn.addEventListener("click", () => {
  display();
});

// Initially display data on page load
// display();

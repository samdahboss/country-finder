const countryList = document.getElementById("countryList");
const searchInput = document.getElementById("searchInput");
const autocomplete = document.getElementById("autocomplete");
const currentLocation = document.getElementById("currentLocation");

let countries = [];

fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    countries = data.sort((a, b) => b.population - a.population); //sort by descending other of population
    renderCountries(countries.slice(0, 20)); // then show popular countries
  });

// 1. Get user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    // 2. Use reverse geocoding to get the country
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await res.json();
    const countryName = data.countryName;

    // 3. Match country from REST countries list
    const match = countries.find(
      (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
    );

    if (match) {
      renderUserLocation(match); // Render user's country
    }
  });
}

// 4. Render user's country card
function renderUserLocation(country) {
  const { name, capital, region, population, currencies, languages} =
    country;

  const currency = Object.values(currencies)[0]?.name;
  const languageList = Object.values(languages).join(", ");

  const wrapper = document.createElement("div");
  wrapper.onclick = () =>
    (window.location.href = `country.html?name=${country.name.common}`);
  wrapper.className = "mb-6 p-4 bg-indigo-100 cursor-pointer rounded-lg shadow text-center";
  wrapper.innerHTML = `
    <h2 class="text-lg font-semibold mb-2 text-indigo-800">You're in</h2>
    <div class="lg:flex items-center justify-between space-y-6 bg-white mb-6 cursor-pointer rounded-lg">
        <div class="lg:w-1/2 p-2 text-center lg:text-left text-2xl">
          <h2 class="text-4xl font-bold mb-2">${name.common}</h2>
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Population:</strong> ${population.toLocaleString()}</p>
          <p><strong>Currency:</strong> ${currency}</p>
          <p><strong>Languages:</strong> ${languageList}</p>
        </div>
        <img src="${country.flags.png}" class="rounded-sm mx-auto border" />
    </div>
  `;
  currentLocation.appendChild(wrapper);
}

function renderCountries(data) {
  countryList.innerHTML = "";
  data.forEach((country) => {
    const card = document.createElement("div");
    card.className =
      "flex items-center gap-3 bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-indigo-50 transition";
    card.onclick = () =>
      (window.location.href = `country.html?name=${country.name.common}`);

    card.innerHTML = `
      <img src="${country.flags.svg}" class="w-8 h-6 rounded-sm border" />
      <span class="text-sm font-medium">${country.name.common}</span>
      <span class="ml-auto text-indigo-500">→</span>
    `;
    countryList.appendChild(card);
  });
}

// Autocomplete
searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  const filtered = countries
    .filter((c) => c.name.common.toLowerCase().includes(val))
    .slice(0, 5);

  if (val && filtered.length > 0) {
    autocomplete.innerHTML = filtered
      .map(
        (c) => `
      <div class="px-4 py-2 hover:bg-indigo-100 cursor-pointer" onclick="selectCountry('${c.name.common}')">
        ${c.name.common}
      </div>
    `
      )
      .join("");
    autocomplete.classList.remove("hidden");
  } else {
    autocomplete.classList.add("hidden");
  }
});

function selectCountry(name) {
  window.location.href = `country.html?name=${name}`;
}

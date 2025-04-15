const params = new URLSearchParams(window.location.search);
const countryName = params.get("name");
const details = document.getElementById("details");

async function loadCountryDetails() {
  try {
    // Fetch from REST Countries API
    const [countryData] = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
    ).then((res) => res.json());

    // Wikipedia API
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        countryName
      )}`
    );
    const wikiData = await wikiRes.json();

    const { name, capital, region, population, currencies, languages, latlng } =
      countryData;

    const currency = Object.values(currencies)[0]?.name;
    const languageList = Object.values(languages).join(", ");

    //Inject HTML first (including map container)
    details.innerHTML = `
      <div class="lg:flex items-center space-y-6 bg-white mb-6">
        <div class="lg:w-1/2 p-2 text-center lg:text-left text-2xl">
          <h2 class="text-4xl font-bold mb-2">${name.common}</h2>
          <p><strong>Capital:</strong> ${capital}</p>
          <p><strong>Region:</strong> ${region}</p>
          <p><strong>Population:</strong> ${population.toLocaleString()}</p>
          <p><strong>Currency:</strong> ${currency}</p>
          <p><strong>Languages:</strong> ${languageList}</p>
        </div>
        ${
          wikiData.thumbnail
            ? `<img src="${wikiData.thumbnail.source}" class="w-1/2 max-w-md mx-auto mb-3 rounded shadow" />`
            : ""
        }
      </div>
      <div class="mt-6">
        <h3 class="text-3xl font-bold mb-2">About ${name.common}</h3>
        <p class="text-gray-700 text-xl">${wikiData.extract}</p>
        <a href="${wikiData.content_urls.desktop.page}" target="_blank" class="underline">
          <button class="bg-gray-700 p-2 text-white rounded-lg mt-6 ml-auto">Read more on Wikipedia</button>
        </a>
      </div>
      <div class="mt-6">
        <div id="map" class="w-full h-64 my-6 rounded-md shadow"></div>
      </div>
    `;

    //Initialize map AFTER the DOM update
    const map = L.map("map").setView(latlng, 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(latlng)
      .addTo(map)
      .bindPopup(`<b>${name.common}</b><br>${capital[0]}`)
      .openPopup();
  } catch (error) {
    console.error(error);
    details.innerHTML = `<p class="text-red-500">Failed to load data for ${countryName}.</p>`;
  }
}

loadCountryDetails();

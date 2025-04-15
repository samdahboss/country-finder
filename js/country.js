const params = new URLSearchParams(window.location.search);
const countryName = params.get("name");
const details = document.getElementById("details");

async function loadCountryDetails() {
  try {
    // Fetch from REST Countries API
    const [countryData] = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`).then(res => res.json());

    // Wikipedia API
    const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`);
    const wikiData = await wikiRes.json();

    const { name, capital, region, population, currencies, languages, flags } = countryData;

    const currency = Object.values(currencies)[0]?.name;
    const languageList = Object.values(languages).join(", ");

    details.innerHTML = `
      <h2 class="text-3xl font-bold mb-2">${name.common}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Region:</strong> ${region}</p>
      <p><strong>Population:</strong> ${population.toLocaleString()}</p>
      <p><strong>Currency:</strong> ${currency}</p>
      <p><strong>Languages:</strong> ${languageList}</p>

      <div class="mt-6">
        <h3 class="text-xl font-semibold mb-2">About ${name.common}</h3>
        ${wikiData.thumbnail ? `<img src="${wikiData.thumbnail.source}" class="w-full max-w-md mx-auto mb-3 rounded shadow" />` : ""}
        <p class="text-gray-700">${wikiData.extract}</p>
        <a href="${wikiData.content_urls.desktop.page}" target="_blank" class="text-indigo-600 underline mt-2 inline-block">Read more on Wikipedia</a>
      </div>
    `;
  } catch (error) {
    console.error(error);
    details.innerHTML = `<p class="text-red-500">Failed to load data for ${countryName}.</p>`;
  }
}

loadCountryDetails();

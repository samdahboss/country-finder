const countryList = document.getElementById("countryList");
const searchInput = document.getElementById("searchInput");
const autocomplete = document.getElementById("autocomplete");

let countries = [];

fetch("https://restcountries.com/v3.1/all")
  .then(res => res.json())
  .then(data => {
    countries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    renderCountries(countries.slice(0, 20)); // First 20 countries
  });

function renderCountries(data) {
  countryList.innerHTML = "";
  data.forEach(country => {
    const card = document.createElement("div");
    card.className = "flex items-center gap-3 bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-indigo-50 transition";
    card.onclick = () => window.location.href = `country.html?name=${country.name.common}`;

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
  const filtered = countries.filter(c => c.name.common.toLowerCase().includes(val)).slice(0, 5);
  
  if (val && filtered.length > 0) {
    autocomplete.innerHTML = filtered.map(c => `
      <div class="px-4 py-2 hover:bg-indigo-100 cursor-pointer" onclick="selectCountry('${c.name.common}')">
        ${c.name.common}
      </div>
    `).join('');
    autocomplete.classList.remove("hidden");
  } else {
    autocomplete.classList.add("hidden");
  }
});

function selectCountry(name) {
  window.location.href = `country.html?name=${name}`;
}

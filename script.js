document.getElementById("search-btn").addEventListener("click", function () {
  const countryName = document.getElementById("country-input").value.trim();
  if (countryName === "") {
    alert("Please enter a country name.");
    return;
  }

  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Country not found. Please try a different name.");
      }
      return response.json();
    })
    .then((data) => {
      // Use the first result for demonstration
      const country = data[0];
      const population = country.population.toLocaleString();
      const capital = country.capital ? country.capital[0] : "N/A";
      const countryCardHTML = `
            <div class="country-card">
              <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
              <div class="info">
                <h2>${country.name.common}</h2>
                <ul class="country-info">
                  <li><strong>Population:</strong> ${population}</li>
                  <li><strong>Region:</strong> ${country.region}</li>
                  <li><strong>Capital:</strong> ${capital}</li>
                </ul>
              </div>
            </div>
          `;
      document.getElementById("country-details").innerHTML = countryCardHTML;
    })
    .catch((error) => {
      document.getElementById("country-details").innerHTML =
        `<p style="text-align:center;color:red;">${error.message}</p>`;
    });
});

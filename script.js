const btnSearch = document.querySelector("#btnSearch");
const textInput = document.querySelector("#txtSearch");
btnSearch.addEventListener("click", () => {
    let text = textInput.value;
    document.querySelector("#details").style.opacity = 0;
    document.querySelector("#loading").style.display = "block"
    getCountry(text);
});
textInput.addEventListener("keydown", (e) => {
    let text = textInput.value;
    if (e.keyCode == 13) {
        getCountry(text);
    }
});
document.querySelector("#btnLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        document.querySelector("#loading").style.display = "block";
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
});
function onError(err) {
    document.querySelector("#loading").style.display = ("none");
};
async function onSuccess(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    // Use opencagedata
    const apiKey = "d4ef0c5ed9654bbfa0aaae86ec4b41be";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const country = data.results[0].components.country;
    document.querySelector("#txtSearch").value = country;
    document.querySelector("#btnSearch").click();

};
async function getCountry(country) {
    try {
        const response = await fetch("https://restcountries.com/v3.1/name/" + country);
        if (!response.ok) {
            throw new Error("No Counrty that name");
        }
        const data = await response.json();
        renderCountry(data[0]);

        const countries = data[0].borders;
        if (!countries) {
            throw Error("There are no neighbors")
        }
        const response2 = await fetch("https://restcountries.com/v3.1/alpha?codes=" + countries.toString());
        const neighbors = await response2.json();
        renderNeighbors(neighbors);
    }
    catch (err) {
        renderError(err)
    }
};
function renderCountry(data) {
    document.querySelector("#loading").style.display = ("none");
    document.querySelector("#country-details").innerHTML = "";
    document.querySelector("#neighbors").innerHTML = "";
    document.querySelector("#sameLanguage").innerHTML = "";
    textInput.value = data.name.common;
    let html = `
            <div class="col-4">
                <img src="${data.flags.png}" alt="" class="img-fluid">
            </div>
            <div class="col-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr>
                <div class="row">
                    <div class="col-4">Population:</div>
                    <div class="col-8">${(data.population / 1000000).toFixed(1)}</div>
                </div>
                <div class="row">
                    <div class="col-4">Language:</div>
                    <div class="col-8" id="language"><a href="#">${Object.values(data.languages)}</a></div>
                </div>
                <div class="row">
                    <div class="col-4">Capital:</div>
                    <div class="col-8">${data.capital}</div>
                </div>
                <div class="row">
                    <div class="col-4">Currency Unit:</div>
                    <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                </div>
            </div>
    `;
    document.querySelector("#details").style.opacity = 1;
    document.querySelector("#country-details").innerHTML = html;
    addEventForCountryData(data);
};
function renderNeighbors(data) {
    let html = "";
    for (let country of data) {
        html += `
                <div class="col-2 mt-2">
                    <div class="card">
                        <img data-name="${country.name.common}" src="${country.flags.png}" class="card-img-top img-fluid flags">
                        <div class="card-body">
                            <h6 class="card-title">${country.name.common}</h6>
                        </div>
                    </div>
                </div>
            `;
    }
    document.querySelector("#neighbors").innerHTML = html;
    addEventToFlags();
};
function renderError(err) {
    document.querySelector("#loading").style.display = ("none");
    const html = `
    <div class="alert alert-danger">
        ${err.message}
    </div>

    `;
    setTimeout(() => {
        document.querySelector("#errors").innerHTML = "";
    }, 3000);
    document.querySelector("#errors").innerHTML = html;
};
function addEventToFlags() {
    const countryFlags = document.querySelectorAll(".flags");
    countryFlags.forEach(flag => {
        flag.addEventListener("click", () => {
            const flagName = flag.dataset.name
            getCountry(flagName);
        })
    })
};
function addEventForCountryData(data) {
    const language = document.querySelector("#language");
    language.addEventListener("click", () => {
        getSameLanguageCountryFromFetch(Object.values(data.languages));
    })
};
async function getSameLanguageCountryFromFetch(language) {
    try {
        const response = await fetch("https://restcountries.com/v3.1/lang/" + language);
        if (!response.ok) {
            throw new Error("No country same language")

        }
        const data = await response.json();
        renderSameLanguageCountries(data)
    }
    catch (err) {
        renderError(err)
    }
};
function renderSameLanguageCountries(data) {
    let html = "";
    for (let language of data) {
        html += `
                <ol class="list-group">
                    <li class="list-group-item d-flex justify-content-between">
                        <div class="fw-bold">
                        ${language.name.common}
                        </div>
                        <span class="badge bg-primary rounded-pill">${language.capital}</span>
                    </li>
                </ol>
            `;
    }
    document.querySelector("#sameLanguage").innerHTML = html;
};

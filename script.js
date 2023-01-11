// const btn = document.querySelector("#btnSearch");
// let text = document.querySelector("#txtSearch");
// btn.addEventListener("click", () => {
//     text.value;
//     getCountry(text);
// })
document.querySelector("#btnSearch").addEventListener("click", () => {
    let text = document.querySelector("#txtSearch").value;
    getCountry(text);
})
function getCountry(country) {
    const request = new XMLHttpRequest();
    request.open("GET", "https://restcountries.com/v3.1/name/" + country);
    request.send();
    request.addEventListener("load", function () {
        const data = JSON.parse(this.responseText);
        renderCountry(data[0]);
        // Load Neighbors
        const countries = data[0].borders.toString();
        const reqst = new XMLHttpRequest();
        reqst.open("get", "https://restcountries.com/v3.1/alpha?codes=" + countries);
        reqst.send();
        reqst.addEventListener("load", function () {
            const data = JSON.parse(this.responseText);
            renderNeighbors(data);
        })
    });
}
function renderCountry(data) {
    let html = `
<div class="card-header">Search Results</div>
    <div class="body">
        <div class="row">
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
                    <div class="col-8">${Object.values(data.languages)}</div>
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
        </div>
    </div>
    `;
    document.querySelector("#country-details").innerHTML = html;

}
function renderNeighbors(data) {
    let html = "";
    for (let country of data) {
        html += `
                <div class="col-2 mt-2">
                    <div class="card">
                        <img src="${country.flags.png}" class="card-img-top">
                        <div class="card-body">
                            <h6 class="card-title">${country.name.common}</h6>
                        </div>
                    </div>
                </div>
            `;
    }
    document.querySelector("#neighbors").innerHTML = html;
}

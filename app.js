const url = 'https://places-dsn.algolia.net/1/places/query';    // URL API Algolia/
// fonction qui retourne la premier lettre en majuscule
function strUpFirst(a){return a.charAt(0).toUpperCase()+a.substr(1);}
// Tester l'api dans le terminal puis dans le navigateur
fetch(url)
.then(response => response.json())
.then((json) => console.log(json));


// Avec fetch, envoyer une requête POST avec la valeur du formulaire et afficher la reponse dans la console puis dans une page HTML

const input = document.querySelector("#address");
const placeList = document.querySelector("#placeList")
const result = document.querySelector(".resultSearch")
const button = document.querySelector ("#searchPlace")

// Create a function
const searchAlgoliaPlaces = (event) => {
    fetch("https://places-dsn.algolia.net/1/places/query", {
    method: "POST",
    body: JSON.stringify({ query: event.currentTarget.value })
    })
    .then(response => response.json())
    .then((data) => {
        placeList.innerHTML= '';
        // afficher le div 'resultSearch' dans HTML
        result.style.display = 'block';
        // Parcour le array de data de url
        data.hits.forEach(element => {
            // ajouter le list avec le nome de place et set attribute for list
            placeList.insertAdjacentHTML('beforeend', `
                <div class="city" lat = ${element._geoloc.lat} long =${element._geoloc.lng} style="border-bottom:solid rgb(204, 204, 204) 1px; min-height: 30px"> ${element.locale_names.default}</div>
                `);
        })
                // Get all the div "city" that were added above
            const listResult = document.querySelectorAll(".city") 
            // Run a loop for each city
               listResult.forEach(list => {
                    // When click each city in the list of search result
                    list.addEventListener('click', (event)=>{
                        // the table of search result will be disappear
                        result.style.display = 'none';    
                        // get the geoloc of each place
                        let dataLat = list.getAttribute('lat');
                        let dataLong = list.getAttribute('long');
                        // show a map corresponding to the city that you chose
                        searchMap(dataLat, dataLong);
                         // the name of city will be shown on the search bar
                         input.value = list.textContent;
                         console.log(input.value);
                         meteo(dataLat, dataLong);
                        
                    })
                })         
            })
}
// When the typing of text in the input form, the function is active
input.addEventListener("keyup", searchAlgoliaPlaces)
const close = document.querySelector(".close");
// Click the close button to close the table of search results
close.addEventListener("click", (event) => {
    result.style.display = 'none';
})

// Créer une fonction d'initialisation de la carte
    function searchMap (lat, lng) {
    // Pour recharger le contenu de div où rendre la carte.
    document.getElementById('placemap').innerHTML = '<div id="mapid"></div>';
    // Créer l'objet "mymap" et l'insèrer dans l'élément HTML qui a l'ID "mapid"
    var mymap = L.map('mapid').setView([lat, lng], 11);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaHVvbmdsZSIsImEiOiJja2wwdThlbzc1enBqMnZxdG94Zm53NGtjIn0.nRkv-vEcrvvVDACpcEl2Dw'
    }).addTo(mymap);
    var marker = L.marker([lat, lng]).addTo(mymap);     
}

// afficher le carte de Paris
// searchMap(48.852969, 2.349903)

// Méteo
const weatherDisplay = document.querySelector("#weatherDisplay");

const meteo = (latw, lonw) => {
    const urlw = `https://api.openweathermap.org/data/2.5/weather?lat=${latw}&lon=${lonw}&appid=1abe37033eebb4aecca8ec35ced4a67b&lang=fr&units=metric`;
    weatherDisplay.innerHTML = "";
    console.log(urlw);
    // .1. Traitement pour avoir la météo actuelle
    fetch(urlw)
    .then(response => response.json())
    .then((data) => {

        // Traitement pour l'icone de météo a afficher en fonction de la météo actuelle
        const condition = data.weather[0].description;
        let weatherIcon;

        switch (condition) {
            case 'couvert':
                weatherIcon = `fa-cloud`;
                break;
            case 'ensoleillé':
                weatherIcon = `fa-sun`;
                break;
            case 'nuageux':
                weatherIcon = `fa-cloud`;
                break;
            case 'partiellement nuageux':
                weatherIcon = `fa-cloud-sun`;
                break;
            case 'ciel dégagé':
                weatherIcon = `fa-sun`;
                break;
            case 'brume':
                weatherIcon = `fa-smog`;
                break;
            case 'légères chutes de neige':
                weatherIcon = `fa-snowflake`;
                break;
            case 'peu nuageux':
                weatherIcon = `fa-cloud-sun`;
                break;
            case 'pluie modérée':
                weatherIcon = `fa-cloud-rain`;
                break;
            case 'chute de neige':
                weatherIcon = `fa-snowflake`;
                break;
            case 'brouillard':
                    weatherIcon = `fa-smog`;
                break;
            case 'légère pluie':
                    weatherIcon = `fa-cloud-rain`;
                break;
            case 'chutes de neige':
                    weatherIcon = `fa-snowflake`;
                break;
            case 'fumée':
                    weatherIcon = `fa-smog`;
                break;
        }
        // fin du traitement de l'icone
      

        // traitement d'affichage des information de meteo 
        weatherDisplay.insertAdjacentHTML("afterbegin", `<h2 class="div1 margin">${data.name}</h2>`);
        weatherDisplay.insertAdjacentHTML("beforeend", `<p class="div3 margin"><i class="fas fa-temperature-high"></i> ${Math.round(data.main.temp)}ºC</p>`);
        weatherDisplay.insertAdjacentHTML("beforeend", `<p class="div2 margin"><i class="fas ${weatherIcon}"></i></p>`);          
        weatherDisplay.insertAdjacentHTML("beforeend", `<p class="div5 margin">Ressenti ${Math.round(data.main.feels_like)}ºC</p>`);
        weatherDisplay.insertAdjacentHTML("beforeend", `<p class="div4 margin">${strUpFirst(condition)}</p>`);
        weatherDisplay.insertAdjacentHTML("beforeend", `<p class="div6 margin"><i class="fas fa-wind"></i> Vent ${Math.round(data.wind.speed * 3.6)} km/h</p>`);
        weatherDisplay.insertAdjacentHTML("beforeend", `<p class="div7 margin"><i class="fas fa-tint"></i> Humidité ${data.main.humidity} %</p>`);
        
    })
    // traitement d'erreur
    .catch(() => {
        weatherDisplay.insertAdjacentHTML("beforeend", "Nom de ville introuvable");
    })
    // .1. FIN Traitement pour avoir la météo actuelle


    // .2. Traitement pour avoir les previsions sur 5 jours avec un graphique
    const urlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${latw}&lon=${lonw}&appid=1abe37033eebb4aecca8ec35ced4a67b&lang=fr&units=metric`;

    fetch(urlFiveDays)
    .then(response => response.json())
    .then((dataFiveDays) => {
        
        // traitement pour obtenir la temperature a 15:00h sur les 5 prochains jours
        let nextFivedaysTemp = [];
        let nextFiveDays = [];

        dataFiveDays.list.forEach(element => {
            if(element.dt_txt.substr(11) == "15:00:00"){
                nextFivedaysTemp.push(Math.round(element.main.temp))
                nextFiveDays.push(element.dt_txt.substr(5,5))
            }   
        });
        

//........................GRAPHIQUE.......................................................................... 
        Chart.defaults.global.title.display = true;
        Chart.defaults.global.title.text = "titre";

        var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: nextFiveDays,
                    datasets: [{
                        label: 'Temperature en ºC',
                        // backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: nextFivedaysTemp 
                    }]
                },
                // Configuration options go here
                options: {
                    title: {
                        text: "PRÉVISIONS SUR 5 JOURS",
                        fontColor: "rgb(255, 255, 255)",
                        fontFamil: "'Raleway', sans-serif",
                        fontSize: 20
                    } 
                }
            });
//..................................................................................................        
    })
    // .2. FIN Traitement pour avoir les previsions sur 5 jours

}

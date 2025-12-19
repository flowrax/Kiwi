// route.js

// Mapping van blogs.js landnamen naar GeoJSON id (ISO 3166-1 alpha-2)
const countryNameToCode = {
    const countryNameToCode = {
  "albanië": "AL",
  "andorra": "AD",
  "armenië": "AM",
  "oostenrijk": "AT",
  "azerbeidzjan": "AZ",
  "belgië": "BE",
  "bosnië": "BA",
  "bulgarije": "BG",
  "kroatië": "HR",
  "cyprus": "CY",
  "tsjechië": "CZ",
  "denemarken": "DK",
  "estland": "EE",
  "finland": "FI",
  "frankrijk": "FR",
  "georgië": "GE",
  "duitsland": "DE",
  "griekenland": "GR",
  "hongarije": "HU",
  "ijsland": "IS",
  "ierland": "IE",
  "italië": "IT",
  "kazachstan": "KZ",
  "kosovo": "XK",
  "letland": "LV",
  "liechtenstein": "LI",
  "litouwen": "LT",
  "luxemburg": "LU",
  "malta": "MT",
  "moldavië": "MD",
  "monaco": "MC",
  "montenegro": "ME",
  "nederland": "NL",
  "noorwegen": "NO",
  "polen": "PL",
  "portugal": "PT",
  "roemenië": "RO",
  "rusland": "RU",
  "servië": "RS",
  "slovenië": "SI",
  "slowakije": "SK",
  "spanje": "ES",
  "zweden": "SE",
  "zwitserland": "CH",
  "turkije": "TR",
  "iran": "IR",
  "maleisië": "MY",
  "sri lanka": "LK"
};

    // Voeg hier meer toe als nodig
};

// Haal bezochte landen uit blogs.js en converteer naar codes
const visitedCountries = Array.from(new Set(
    window.blogs
        .map(blog => countryNameToCode[blog.land.toLowerCase()])
        .filter(Boolean)
));

// Init kaart
const map = L.map('visited-map').setView([20, 0], 2);

// Basiskaartlaag
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// GeoJSON werelddata
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(geojson => {

        function style(feature) {
            return {
                fillColor: visitedCountries.includes(feature.id) ? '#f9a825' : '#ccc',
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }

        L.geoJson(geojson, {
            style: style,
            onEachFeature: function(feature, layer) {
                layer.bindTooltip(feature.properties.name);

                layer.on('click', function() {
                    // Filter blogs per land
                    const blogsForCountry = window.blogs.filter(blog => countryNameToCode[blog.land.toLowerCase()] === feature.id);

                    let popupContent = `<strong>${feature.properties.name}</strong><br>`;
                    if (blogsForCountry.length > 0) {
                        blogsForCountry.forEach(blog => {
                            popupContent += `${blog.titel}<br>`; // later kun je links toevoegen
                        });
                    } else {
                        popupContent += "Geen blogs beschikbaar";
                    }

                    layer.bindPopup(popupContent).openPopup();
                });
            }
        }).addTo(map);
    });

const request = require('request');  // http request modul

// Geocoding.. proces konvertiranja string adrese u latitude/longitude .. iz mapbox.com .. lokacija je u url-u iza .places/ do .json

// naša callback reusable funkcija koja uspostavlja URL poziv i dobiva geolokacijske podatke
// možemo je koristiti i pozivati odakle želimo
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1552663217058&autocomplete=false&proximity=16.0389153%2C45.826543799999996&routing=true&limit=1';
    request({url, json: true}, (error, {body}) => {  // url je object shorthand za url: url.. {body} je destrucutred property objecta response
        if (error) {
            callback('Unable to connect to location services'); // ako je error u cb() definiramo samo priv parametar, drugi bude undefined
        } else if (body.features.length === 0) {  // drugi error, ako nema response-a
            // drugi atgument je isto undefined, samo je ivdje napisan (ne treba)
            callback('Unable to find location. Try another search', undefined);  
        } else {  // ako nema greške i našao je lokaciju..
            callback(undefined, {  // kao error pošalji undefined, drugi argument pošalji object sa odabranim dobivenim podacima (ne treba sve)
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    });
};

module.exports = geocode;
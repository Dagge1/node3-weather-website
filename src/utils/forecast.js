// callback za forecast prema geolokaciji
const request = require('request');  // http request modul

// request za vremensku prognozu za lokaciju sa long/lat - osnovni returned object je body, već je JSON

const forecast = (lat, long, callback) => {
    const url = 'https://api.darksky.net/forecast/d2715f3422c464fc9e56e05b1f098846/' + lat + ',' + long + '?units=si';
    request({url, json: true}, (error, {body}) => {  // prvi arg je option object, drugi je cb funkcija.. restructured object response, koristimo body property direktno
        if (error) { // ako nema Interneta
            callback('Unable to connect to weather URL');  // ako je samo jedan argument taj je automatski za error, ne treba drugi arg pisati undefined
        } else if (body.error) {  // ako je kriva adresa
            callback('Unable to find location');
        } else {  // ovdje callback treba prvi argument (error) pisati undefined
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is a ' + body.currently.precipProbability + '% chance of rain.');
        }
    });
}    

module.exports = forecast;
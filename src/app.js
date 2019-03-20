// main back-end file
// server - dovoljno je definirati static folder i unutra staviti sve html, css image, te sa express.static() definirati taj folder kao root za sajt
// Nakon toga ne treba posebno html stranice servati sa routama

const path = require('path');  // prvo core Node modules, onda instalirani NPM moduli, ne treba instalirati
const express = require('express');
const app = express();
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// path.join() kombinira različite dijelove adrese u jedinstveni path, prvi dio je apsolutni path do root direktorija drugi je nastavak patha
// drugi dio patha '..' znači jedan direktorij natrag od onog u kojem smo  '../..' ide dva direktorija unatrag
//console.log(path.join(__dirname, '../public'));  

// set() postavlja value za određeni Express key, tj ima key i value par, 
// key je ovdje 'view engine'a value handlebars templating engine, hbs je handlebars za Express. Ne treba require modula
app.set('view engine', 'hbs');  // default lokacija gdje Express traži template fajlove je views/


// *** ako želimo primijeniti default folder za template fajlove onda promijeni default folder:
//app.set('views', path.join(__dirname, '../template'))  // ako uključimo tražiti će template fajlove u template/ a ne views/


// express static je express funkcija za odrediti static folder, kao arg uzima path do static foldera
// express će automatski servati index.html fajl iz static foldera (ne treba posebno slati fajl na front-end)
app.use(express.static(path.join(__dirname, '../public')));  

app.get('/', (req, res) => {
    res.render('index', {  // renderira index.hbs template stranicu, zna da je defaultno u views/, drugi arg je poslani obj sa podacima
        title: 'Weather App',
        name: 'Andrew Mead'
    }); 
});

app.get('/about', (req, res) => {
    res.render('about', {  
        title: 'About me',
        name: 'Andrew Mead'
    }); 
});

app.get('/help', (req, res) => {
    res.render('help', {  
        title: 'Help page',
        msg: 'This is a help page'
    }); 
});


// ****************
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You have to provide city'
        });
    }


    // defaultna adresa je london ako ne prepozna adresu, inače daje grešku (probaj) .. = {} je default vrijednost ako ne unesemo grad, tako neće crashati server
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {  // object destructuing, sa {} koristimo direktno imea iz objecta u geocode.js
        req.query.address = req.query.address || 0;
        if (error) {  
            return res.send({
                error  // ES6
            });
        }
    
    // prognoza za grad koji smo dobili sa funkcijom geocode.. lat/long
    forecast(latitude, longitude, (error, forecast) => {  // koristimo destructured (direktione) nazive varijabli latitude longitude i forecast iz geocode.js
        if (error) {  
            return res.send({error}); 
        }
        res.send({
            forecast:forecast,
            location,
            address: req.query.address
        });
    });
    });

});

// *******************

app.get('/products', (req, res) => {
    if (!req.query.search) {  // ako ne polašlje search term
        return res.send({  // sa return funkcija prekida izvršenje, tj neće se izvršiti još jedan res.send() ispod
            error: 'You must provide search term'
        });  // req.query je query object sa key-value parovima informacija poslanim u URL-u sa ?search=games
    }
    console.log(req.query);  
    res.send({
        products: []
    });
});

// ya nepostojeé route unutar help/ poddirektorija
app.get('/help/*', (req, res) => {
    res.send('404 - Not found document in /help folder');
});

// za sve nepostojeće url-ove, error 404 .. sa * .. mora biti zadnja routa
app.get('*', (req, res) => {
    res.send('404 - not found document');
});


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
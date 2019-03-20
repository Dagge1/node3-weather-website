// front end js


const weatherForm = document.querySelector('form'); // vraća js reprezentaciju tog DOM elementa
const search = document.querySelector('input');  // dohvaćamo sadržaj <input> elementa
const messageOne = document.querySelector('#message-1');  // lokacija za ispis poruka
const messageTwo = document.querySelector('#message-2');

weatherForm.addEventListener('submit', (event) => {  // dodaj event listener na Button
    event.preventDefault();  // prevenira refresh ekrana nakon klika
    const location = search.value;
    
    messageOne.textContent = 'Loading...'; // prvo isprazni poruke i ovdje napšiši loading
    messageTwo.textContent = ''; 
    
    // fetch je browser client-side js generic http request, ne radi u Node backendu
    fetch('http://localhost:3000/weather?address=' + location)
        .then((response) => {  // Promise, tek kada dobije odgovor lansira callback
            response.json().then((data) => {
                if (data.error) {
                    messageOne.textContent = data.error; 
                } else {
                    messageOne.textContent = data.location; 
                    messageTwo.textContent = data.forecast; 
                }
            });
        });
});    
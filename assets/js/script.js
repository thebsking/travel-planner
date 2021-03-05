//declare global vars
let originCity;
let destinationCity;


//build weather api calls https://rapidapi.com/skyscanner/api/skyscanner-flight-search/endpoints
function getCities(origin, destination){
    //origin city
    fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${origin}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ce048e25a7msh11dfbb222457908p124048jsn5f6dec3c93ab",
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
	}
    })
        .then(response => response.json())
        .then(data => {
            originCity = data.Places[0].CityId;
            console.log(originCity)
        })
        .catch(err => {
            console.error(err);
        });
    //destination city
    fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=${destination}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ce048e25a7msh11dfbb222457908p124048jsn5f6dec3c93ab",
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
	}
    })
        .then(response => response.json())
        .then(data => {
            destinationCity = data.Places[0].CityId
            console.log(destinationCity)
        })
        .catch(err => {
            console.error(err);
        });
};  
function getFlights (origin, destination)

//build maps api calls https://developers.google.com/maps/documentation/javascript/overview

//add click event for submission

//render api response data to page
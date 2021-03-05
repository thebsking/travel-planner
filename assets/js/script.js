//declare global vars
let originCity;
let destinationCity;
let leaveDate = document.$('#datepicker1').val()
let returnDate = document.$('#datepicker2').val()

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
            originCity = data.Places[0].PlaceId;
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
            destinationCity = data.Places[0].PlaceId;
            console.log(destinationCity)
        })
        .catch(err => {
            console.error(err);
        });
};  
function getFlights (origin, destination){
  fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${originCity}/${destinationCity}/${leaveDate}?inboundpartialdate=${returnDate}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ce048e25a7msh11dfbb222457908p124048jsn5f6dec3c93ab",
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});
}

//build maps api calls https://developers.google.com/maps/documentation/javascript/overview

//add click event for submission

//render api response data to page
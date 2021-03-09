
//DatePicker Functions
$( function() {
    $( "#datepicker1" ).datepicker();
  } );

  $( function() {
    $( "#datepicker2" ).datepicker();
  } );
  
 

  //declare global vars
let originCity;
let destinationCity;
let flightObject;


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
            return originCity;
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
            getFlights(originCity, destinationCity)
        })
        .catch(err => {
            console.error(err);
        });


  
};  
function getFlights (origin, destination){
  let leaveDate = new Date($('#datepicker1').val()).toISOString().split('T');
  let returnDate = new Date($('#datepicker2').val()).toISOString().split('T');
  //dates currently not set to correct format
  //maybe use moment.js? 
  fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${origin}/${destination}/${leaveDate[0]}?inboundpartialdate=${returnDate[0]}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ce048e25a7msh11dfbb222457908p124048jsn5f6dec3c93ab",
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
	}
})
.then(response => response.json())
.then(data => {
  console.log(data)
  flightObject = data;
  
  //render api response data to page
  let flightEL = $('#flightDisplay')
  flightEL.append(`Cheapest flight is: $${flightObject.Quotes[0].MinPrice}`)
  secondFlight = flightEL.append('<p>')
  secondFlight.append(`other options start at: $${flightObject.Quotes[1].MinPrice}`)
  
})
.catch(err => {
	console.error(err);
});
}

//add click event for submission
$('.submitButton').on('click', function(){
  getCities($('#depCity').val(), $('#arrCity').val());
})

//google maps geocode fetch
function mapsGeoCode(){
fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${originCity}&key=AIzaSyCXR3B8D3lybOR4VE3nXoUDrf7V8-NTiB8`)
}
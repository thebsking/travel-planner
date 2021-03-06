
//DatePicker Functions
$( function() {
    $( "#datepicker1" ).datepicker();
  } );

  $( function() {
    $( "#datepicker2" ).datepicker();
  } );
  $( function() {
    $( "#depCity" ).selectmenu();
 
    $( "#arrCity" ).selectmenu();
 
   
  } );

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
  let leaveDate = $('#datepicker1').val()
  let returnDate = $('#datepicker2').val()
  fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${origin}/${destination}/2021-03-05?inboundpartialdate=2021-03-10`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "ce048e25a7msh11dfbb222457908p124048jsn5f6dec3c93ab",
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
	}
})
.then(response => response.json())
.then(data => {
  console.log(data)
})
.catch(err => {
	console.error(err);
});
}

let apiKey = "3ac0d8db34de82819d13a9167239acc1";
let searchBtn = $(".searchBtn");
let searchInput = $(".searchInput");


let cityNameEl = $(".CityName");
let currentDateEl = $(".currentdate");
let weatherIconEl = $(".WeatherIcon");
let searchHistoryEl = $(".history");


let tempEl = $(".temp");
let humidityEl = $(".humidity");
let windSpeedEl = $(".windspeed");
let uvIndexEl = $(".UVindex");

var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' +yyyy;

if (JSON.parse(localStorage.getItem)('searchHistory'))  null 
  console.log('searchHistory not found')

 (console.log('searchHistory loaded into searchHistoryArr'));
  renderSearchHistory();


searchBtn.on('click', function(e) {
  e.preventDefault();
  if (searchInput.val() === ''){
    alert('You Must Pick A City');
    return;
  }
  console.log('clicked button')
  getWeather(searchInput.val());
}

//build maps api calls https://developers.google.com/maps/documentation/javascript/overview

//add click event for submission
$('.flights').on('click', function(){
  getCities();
  getFlights();
})


//render api response data to page 
)

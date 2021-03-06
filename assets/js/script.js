
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
})
.catch(err => {
	console.error(err);
});
}

//build maps api calls https://developers.google.com/maps/documentation/javascript/overview
function getAttractions(destination){
  var map;
  var service;
  var infowindow;

  function initialize() {
    var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });

    var request = {
      location: pyrmont,
      radius: '500',
      query: 'restaurant'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
  }

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }
}

//add click event for submission
$('.flights').on('click', function(){
  getCities('Columbus', 'Orlando');
})


//render api response data to page


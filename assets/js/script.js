
//DatePicker Functions
$(function () {
  $("#datepicker1").datepicker();
});

$(function () {
  $("#datepicker2").datepicker();
});



//declare global vars
let originCity;
let destinationCity;
let flightObject;
let googleCityCoords;
//const mapEl = document.getElementById('map')

//build weather api calls https://rapidapi.com/skyscanner/api/skyscanner-flight-search/endpoints
function getCities(origin, destination) {
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
          return destinationCity
        })
        .catch(err => {
          console.error(err);
        });
    })
    .catch(err => {
      console.error(err);
    });




};
function getFlights(origin, destination) {
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

<<<<<<< HEAD
      //render api response data to page
      let flightEL = $('#flightDisplay')
      flightEL.append(`Cheapest flight is: $${flightObject.Quotes[0].MinPrice}`)
      secondFlight = flightEL.append('<p>')
      secondFlight.append(`other options start at: $${flightObject.Quotes[1].MinPrice}`)

    })
    .catch(err => {
      console.error(err);
    });
  mapsGeoCode();
}
=======

//build maps api calls https://developers.google.com/maps/documentation/javascript/overview
>>>>>>> 65266a8b927773b24f2ced34885e05bf5a9e0c73

//add click event for submission
$('.submitButton').on('click', function () {
  getCities($('#depCity').val(), $('#arrCity').val());
})

//google maps geocode fetch
function mapsGeoCode() {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${$('#arrCity').val()}&key=AIzaSyCXR3B8D3lybOR4VE3nXoUDrf7V8-NTiB8`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      googleCityCoords = data.results[0].geometry.location;
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDz091kyRUnde4u6imdbCufy_dba23YnPc&libraries=places&callback=initMap"
      script.async = true;
      
      document.head.appendChild(script);
    })

<<<<<<< HEAD
}
=======
//render api response data to page 
>>>>>>> 65266a8b927773b24f2ced34885e05bf5a9e0c73

let map;
let service;
      function initMap() {
        console.log(googleCityCoords);
        map = new google.maps.Map(document.getElementById("map"), {
          center: googleCityCoords,
          zoom: 15,
        });
        let request ={
          location: googleCityCoords,
          radius: '500',
          query: 'tourist_attraction'
        };
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback)
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
              console.log(place);
            }
          }
        }
        
      }
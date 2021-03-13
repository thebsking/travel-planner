
//DatePicker Functions
$(function () {
  $("#datepicker1").datepicker();
});

$(function () {
  $("#datepicker2").datepicker();
});



//declare global vars
const departureCity = $('.depCity')
const arrivalCity = $('.arrCity')
let originCity;
let destinationCity;
let flightObject;
let googleCityCoords = {
  "lat": 39.9611755,
  "lng": -82.99879419999999
};


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
          
          getFlights(originCity, destinationCity)
        })
        .catch(err => {
          console.error(err);
          const cityAlert = document.createElement('div')
          cityAlert.classList.add('alert', 'alert-danger')
          cityAlert.textContent = 'Check your city name and try again'
          $('.cityPicker').append(cityAlert)
        });
    })
    .catch(err => {
      
      console.error(err);
      const cityAlert = document.createElement('div')
      cityAlert.classList.add('alert', 'alert-danger')
      cityAlert.textContent = 'Check your city name and try again'
      $('.cityPicker').append(cityAlert)
    });




};
function getFlights(origin, destination) {

  
  let leaveDate = new Date($('#datepicker1').val()).toISOString().split('T');
  let returnDate = new Date($('#datepicker2').val()).toISOString().split('T');
  if (leaveDate[0] < Date.now()) {
    let pastAlert = document.createElement('div')
    pastAlert.setAttribute('role', 'alert')
    pastAlert.classList.add('alert', 'alert-danger')
    pastAlert.textContent = 'You cannot travel to the past, please try again'
    $('.departureDate').append(pastAlert)
  }
  if (returnDate[0] < Date.now()) {
    let pastAlert = document.createElement('div')
    pastAlert.setAttribute('role', 'alert')
    pastAlert.classList.add('alert', 'alert-danger')
    pastAlert.textContent = 'You cannot travel to the past, please try again'
    $('.arrivalDate').append(pastAlert)
  }
  fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${origin}/${destination}/${leaveDate[0]}?inboundpartialdate=${returnDate[0]}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "ce048e25a7msh11dfbb222457908p124048jsn5f6dec3c93ab",
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
    }
  })
    .then(response => response.json())
    .then(data => {
      
      flightObject = data;

      //render api response data to page
      const flightEL = document.createElement('a')
      flightEL.classList.add('flightDisplay')
      document.querySelector('.textField').appendChild(flightEL)
      if (flightObject.Quotes.length == 0){
        flightEL.append('Sorry, no flights found')
      }
      flightEL.append(`Cheapest flight is: $${flightObject.Quotes[0].MinPrice}`)
      const secondFlight = document.createElement('a')
        secondFlight.classList.add('flightDisplay')
        document.querySelector('.textField').appendChild(secondFlight)
      if (flightObject.Quotes.length > 1){
        secondFlight.append(`other options start at: $${flightObject.Quotes[1].MinPrice}`)
      } else { 
        secondFlight.append('no other flights found')
      }
    })
    .catch(err => {
      console.error(err);
    });
  mapsGeoCode();
}

//add click event for submission

$('.submitButton').on('click', function () {
  if(document.querySelector('.flightDisplay')) {
    let flightList = document.querySelectorAll('.flightDisplay');
    for (var i =0; i < flightList.length; i++){
      flightList[i].remove();
    }
  }
  if(document.querySelector('#attraction-list')){
    document.querySelector('#attraction-list').innerHTML = '';
  }
  getCities($('#depCity').val(), $('#arrCity').val());
})

//google maps geocode fetch
function mapsGeoCode() {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${$('#arrCity').val()}&key=AIzaSyCXR3B8D3lybOR4VE3nXoUDrf7V8-NTiB8`)
    .then(response => response.json())
    .then(data => {
      
      googleCityCoords = data.results[0].geometry.location;
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDz091kyRUnde4u6imdbCufy_dba23YnPc&libraries=places&callback=initMap"
      script.async = true;

      document.head.appendChild(script);
    })

}

//map initialization function
let map;
let service;
function initMap() {
  
  map = new google.maps.Map(document.getElementById("map"), {
    center: googleCityCoords,
    zoom: 15,
  });
  let request = {
    location: googleCityCoords,
    radius: '500',
    query: 'tourist_attraction',
    price_level: '0'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback)
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      
      
      //create ul for attractions
      const attractionList = document.createElement('ul')
      attractionList.setAttribute('id', 'attraction-list')
      attractionList.textContent = 'Top 5 free things to see'
      $('.flightPlanner').append(attractionList)
      
      //append attractions to ul
      for (var i = 0; i < 5; i++) {
        var place = results[i];
       
        let listItem = document.createElement('li')
        listItem.textContent = place.name
        attractionList.appendChild(listItem);
      }
    }
  }

}

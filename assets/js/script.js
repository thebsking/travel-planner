
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


let apikey = "8ea5e3b221a4d2081f62d72fcf91cf98"
let searchBtn = $(".searchBtn");
let searchInput = $(".searchInput");


let cityNameEl = $(".CityName");
let currentDateEl = $(".CurrentDate");
let weatherIconEl = $(".WeatherIcon");
let searchHistoryEl = $(".History");


let TempEl = $(".Temp");
let HumidityEl = $(".Humidity");
let WindSpeedEl = $(".WindSpeed");
let UVIndexEl = $(".UVIndex");
let cardRow = $(".card-row");


var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' + yyyy;

if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
    console.log("searchHistory not found")
}else{
    console.log("searchHistory loaded into searchHistoryArr");
    renderSearchHistory();
}

searchBtn.on("click", function(e) {
    e.preventDefault();
    if (searchInput.val() === "") {
        alert("You must enter a city");
        return;
    }
    console.log("clicked button")
    getWeather(searchInput.val());
});



function renderWeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    cityNameEl.text(cityName)
    currentDateEl.text(`(${today})`)
    tempEl.text(`Temperature: ${cityTemp} °F`);
    humidityEl.text(`Humidity: ${cityHumidity}%`);
    windSpeedEl.text(`Wind Speed: ${cityWindSpeed} MPH`);
    uvIndexEl.text(`UV Index: ${uvVal}`);
    weatherIconEl.attr("src", cityWeatherIcon);
}

function getWeather(desiredCity) {
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(weatherData) {
        let cityObj = {
            cityName: weatherData.name,
            cityTemp: weatherData.main.Temp,
            cityHumidity: weatherData.main.Humidity,
            cityWindSpeed: weatherData.Wind.Speed,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    .then(function(uvData) {
        if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
            let searchHistoryArr = [];
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                renderSearchHistory(cityObj.cityName);
            }else{
                console.log("City already in searchHistory. Not adding to history list")
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }else{
            let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName); 
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                renderSearchHistory(cityObj.cityName);
            }else{
                console.log("City already in searchHistory. Not adding to history list")
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }
    })
        
    });
    getFiveDayForecast();

    function getFiveDayForecast() {
        cardRow.empty();
        let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function(fiveDayReponse) {
            for (let i = 0; i != fiveDayReponse.list.length; i+=8 ) {
                let cityObj = {
                    date: fiveDayReponse.list[i].dt_txt,
                    icon: fiveDayReponse.list[i].weather[0].icon,
                    temp: fiveDayReponse.list[i].main.temp,
                    humidity: fiveDayReponse.list[i].main.humidity
                }
                let dateStr = cityObj.date;
                let trimmedDate = dateStr.substring(0, 10); 
                let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
            }
        })
    }   
}

function createForecastCard(date, icon, temp, humidity, windspeed, UVindex) {
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h3>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "WeatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}



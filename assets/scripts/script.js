
var APIKey = "b8030074488a520a4b5c546d49797659";
var weatherCities = [""]; 
var lastCityIndex = 0;  

// get any previously searched cities and last used from local storage 

var storedCities = localStorage.getItem("weatherCities"); 
console.log(storedCities); 
if (storedCities === null) { 
    weatherCities = ["Raleigh"];      
}
else { 
    weatherCities = JSON.parse(storedCities); 
    lastCityIndex = localStorage.getItem("lastCityIndex"); 
}
 
buildButtons();

var cityName = weatherCities[lastCityIndex];   
var currentDate = moment().format('dddd[,] MMMM DD[,] YYYY');
var shortCurrentDate = moment().format('MM[/]DD[/]YYYY')


$("#get-city").on("click", function () {
    event.preventDefault();
    cityName = $("#search-city").val();
    // set appropriate case 
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1); 
    getCityData(cityName);
    $("#search-city").val("");
});

// for a click on any previous city's button 

$(document).on("click", ".city-button", function () {
    getCityData($(this).text());
});

function getCityData(cityName) {
    
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
    "&units=imperial&appid=" + APIKey;
    
    $.ajax({
        url: weatherURL,
        method: "GET", 
        error: function (xhr, ajaxOptions, thrownError) {
            errorMessage("City search: " + thrownError);
        }
    })
    // Returned data in object called "response"
    .then(function (response) {
        
        addCity(cityName);

        // Log for testing 
        console.log(weatherURL);
        console.log("Response: " + response);
        
        // Transfer content to HTML
        $("#city-name").text(cityName + ": " + currentDate);
        $("#short-city-name").text(cityName + ": " + shortCurrentDate); 
        
        var weatherData = response.weather[0].main.toLowerCase();  
        var iconSrc = 'https://openweathermap.org/img/wn/' + 
        response.weather[0].icon + "@2x.png"; 
        $("#weather-icon").attr("src", iconSrc);
        $("#current-temp").html(response.main.temp + " &#8457;");
        $("#current-humidity").text(response.main.humidity + "%");
        $("#current-windspeed").text(response.wind.speed + " MPH ");
        
        // get UV info, setting class for background color  
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + 
        response.coord.lat + 
        "&lon=" +  response.coord.lon + "&appid=" + APIKey;

        $.ajax({
            url: uvURL,
            method: "GET" 
        }).then(function (response) { 
            console.log(response); 
            var uvValue = response.value;
            var uvDisplay = $("#current-uv-index");  
            uvDisplay.text(uvValue); 
            uvValue = parseFloat(uvValue); 
            if (uvValue < 3) {
                $("#current-uv-index").attr("class","p-1 bg-success text-white"); 
            }
            else if (uvValue < 8) {
                    $("#current-uv-index").attr("class","p-1 bg-warning text-dark"); 
                }
                else if (uvValue >= 8) { 
                    $("#current-uv-index").attr("class","p-1 bg-danger text-white"); 
                }
        })

    $("#current-city").removeClass("d-none");  
    var cityId = response.id;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId +
        "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: forecastURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            $("#forecast-cards").empty();
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var dayCard = $("<div>").addClass("card m-2 p-2 forecast");
                    var dateHeader = $("<h6>");
                    dateHeader.text(response.list[i].dt_txt.slice(0, 10));
                    dayCard.append(dateHeader);

                    var cardContent = $("<div>").addClass("card-content");
                    var iconSrc = 'https://openweathermap.org/img/wn/' + 
                          response.list[i].weather[0].icon + "@2x.png"; 
                    var weatherIcon = $("<img>").attr("src", iconSrc);
                    dayCard.append(weatherIcon);
                    cardContent.html("Temp:&nbsp;" + response.list[i].main.temp + " &#8457;" +
                        "<br>Humidity: &nbsp;" + response.list[i].main.humidity + "%");
                    dayCard.append(cardContent);
                    $("#forecast-cards").append(dayCard);
                }

            }

        });

});
}

function addCity(cityName) {
    // see if already in list of cities, add button only if not 
    var cityIndex = weatherCities.indexOf(cityName); 
    if (cityIndex === -1) {
        var newCityButton = $("<button>").addClass("btn city-button btn-outline-secondary pt-2 pb-2 text-align-left");
        newCityButton.attr("data-city", cityName);
        newCityButton.text(cityName);
        $("#past-cities").prepend(newCityButton);
        weatherCities.splice(0, 0, cityName); 
        // save new list of cities 
        storedCities = JSON.stringify(weatherCities); 
        localStorage.setItem("weatherCities",storedCities); 
        localStorage.setItem("lastCityIndex",0)
    }
    else {
        localStorage.setItem("lastCityIndex",cityIndex); 
    }
}

function buildButtons() {
    $("#past-cities").empty();  // not necessary?  
    for (var i = 0; i < weatherCities.length; i++) {
        var newCityButton = $("<button>").addClass("btn city-button btn-outline-secondary pt-2 pb-2 text-align-left"); 
        newCityButton.attr("data-city", weatherCities[i]);
        newCityButton.text(weatherCities[i]);
        $("#past-cities").append(newCityButton); 
    }
}

$("#clear-past-cities").on("click", function () {
   weatherCities = ["Raleigh"]; 
   cityIndex = 0;  
   localStorage.removeItem("lastCityIndex");
   localStorage.removeItem("weatherCities"); 
   buildButtons(); 
});


function errorMessage(msg) {
      // display error in red for two seconds 
      var $errMsgEl = $("#error-message"); 
      $errMsgEl.text(msg); 
      $errMsgEl.removeClass("d-none"); 
      var showMsgTimer = setTimeout( function () { 
        $("#error-message").text("");
        $("#error-message").addClass("d-none");  
        }, 2000);  
}

buildButtons(); 
getCityData(cityName); 

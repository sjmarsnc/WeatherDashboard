
var APIKey = "b8030074488a520a4b5c546d49797659";
var cityName = "";  // default to current location? 
var currentDate = moment().format('dddd[,] MMMM DD[,] YYYY');


$("#get-city").on("click", function () {
    event.preventDefault();
    cityName = $("#search-city").val();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1); 
    getCityData(cityName);
    addCity(cityName);
    $("#search-city").val("");
});

function getWeatherIconURL (weather, size) {

    // set weather icon, ideally would check for nighttime 
    var weatherType = ["clear","rain","cloudy","wind","storm","snow"]; 
    for (var i=0; i < weatherType.length; i++ ) {
        if (weather.indexOf(weatherType[i] > -1)) {
            return "./assets/images/" + weatherType[i] + size + ".png"; 
        }
    }
}

// for a click on any previous city's button 

$(document).on("click", ".city-button", function () {
    getCityData($(this).text());
});

function getCityData(cityName) {

    // var testURL = "https://api.weatherbit.io/v2.0/current?units=I&city=Raleigh,NC&key=3e8568d450e748c788f77d419cb736de";
    // $.ajax({
    //     url: testURL,
    //     method: "GET"
    // }).then(function (response) {
    //     console.log("Response from weatherbit:");
    //     console.log(response); 
    // });

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
        "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: weatherURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // Log for testing 
            console.log(weatherURL);
            console.log(response);

            // Transfer content to HTML
            $("#city-name").text(cityName + ": " + currentDate);
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
            console.log("uvURL: " + uvURL);
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

            console.log(forecastURL);
            console.log(response);

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
    var newCityButton = $("<button>").addClass("btn city-button btn-outline-secondary pt-2 pb-2 text-align-left");
    newCityButton.attr("data-city", cityName);
    newCityButton.text(cityName);
    $("#past-cities").prepend(newCityButton);
}

getCityData("Raleigh");
addCity("Raleigh"); 

if (navigator.geolocation) { 
    navi
}
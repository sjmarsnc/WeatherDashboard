





var APIKey = "b8030074488a520a4b5c546d49797659";
var cityName = "";  // get current location? 


$("#get-city").on("click", function () {
    event.preventDefault();
    cityName = $("#search-city").val();
    getCityData(cityName);
    addCity(cityName);
    $("#search-city").val("");  
});

// for a click on any previous city's button 

$(document).on("click", ".city-button", function () {
    console.log($(this).text());
    getCityData($(this).text());
});

function getCityData(cityName) {

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
            $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);
            $(".temp").text("Temperature (F) " + response.main.temp);

            // Converts the temp to Kelvin with the below formula
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".tempF").text("Temperature (Kelvin) " + tempF);

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + response.main.temp);


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

                });


        });
}

function addCity(cityName) {
    // see if already in list of cities, if not 
    var newCityButton = $("<button>").addClass("btn city-button btn-outline-secondary pt-2 pb-2 text-align-left");
    newCityButton.attr("data-city", cityName);
    newCityButton.text(cityName);
    $("#past-cities").prepend(newCityButton);
}

getCityData("Raleigh");
addCity("Raleigh"); 
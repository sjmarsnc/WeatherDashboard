
var APIKey = "b8030074488a520a4b5c546d49797659";
var cityName = "";  // default to current location? 
var currentDate = moment().format('dddd[,] MMMM DD[,] YYYY');


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
            
            $("#city-name").text(cityName + " Weather on " + currentDate);
            //  need icon  
            $("#current-temp").text(response.main.temp); 
            $("#current-humidity").text(response.main.humidity + "%");
            $("#current-windspeed").text(response.wind.speed + "MPH ");

            // get UV info, setting class for background color  
            var uvURL = "http://samples.openweathermap.org/data/2.5/uvi?lat=" + 
                        response.coord.lat + 
                       "&lon=" +  response.coord.lon + "&appid=" + APIKey;
            $.ajax({
                url: uvURL,
                method: "GET" 
            }).then(function (response) { 
                var uvValue = response.value;
                var uvDisplay = $("#current-uv-index");  
                uvDisplay.text(uvValue); 
                uvValue = parseFloat(uvValue); 
                if (uvValue < 3) {
                    // set color to green 
                }
                else if (uvValue < 8) {
                    // set color to orange
                }
                else if (uvValue >= 8) { 
                    // set color to red 
                }
            })

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
                            dateHeader.text(response.list[i].dt_txt.slice(0,10));  
                            dayCard.append(dateHeader); 
                            // need to add icon 
                            var cardContent = $("<div>").addClass("card-content");
                            cardContent.html("Temp:&nbsp;" + response.list[i].main.temp +
                                 "<br>Humidity: &nbsp;" + response.list[i].main.humidity + "%");
                            dayCard.append(cardContent); 
                            $("#forecast-cards").append(dayCard);  
                        }

                    }


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
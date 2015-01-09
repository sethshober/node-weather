/* 
========================================================================================================================

Problem: 
	We want to get the weather and we only have a zip code.
	We must convert that zip code to coordinates to work with the api.
Solution: 
	Using Node.js, convert the zip code to coordinates by checking it against a data set of all zip codes in America.
	Then to connect to the forecast.io API and retrieve weather data with our coordinates.
	Display weather in the console.

========================================================================================================================
*/
var http = require('http');
var https = require('https');
var zipcodes = require("./zipdata.js");
var data = zipcodes.zipdata;
var zipcode = process.argv.slice(2);
var url = "";
var zipObj = "";
var API_KEY = "";

// check our data set with a zip code and covert to coordinates that is appended to an url and passed to the getWeather
// function, which gets called inside getZipCoordinates function
function getZipCoordinates(zip) {
	//console.log(data);
	for(var i = 0; i < data.length; i++) {
		zipObj = data[i];
		if(zipObj["\"\"zipcode\"\""] == zip){

			var lat = zipObj["\"\"latitude\"\""];
			var lon = zipObj["\"\"longitude\"\""];

			// for testing
			// console.log("latitude: " + lat);
			// console.log("longitude: " + lon);
			// console.log(zipObj);

			lat = lat.slice(3);
			lat = lat.slice(0,-3);

			lon = lon.slice(2);
			lon = lon.slice(0,-3);			

			url = "https://api.forecast.io/forecast/" + API_KEY + "/" + lat + "," + lon;
			//console.log(url);

			break;
		}
	}
	getWeather(url);
}


// get the weather from forecast.io via the url provided from getZipCoordinates function
function getWeather(url) {

	// Connect to API URL (https://api.forecast.io/forecast/API_KEY/lat,lon)
	var request = https.get(url, function(response){

		var body = "";

		//Read the data
		response.on("data", function(chunk){
			body += chunk;
		});

		response.on("end", function() {
			if (response.statusCode === 200) {
				try {
					//Parse the data
					var weather = JSON.parse(body);
					//Print the data
					printMessage(weather);
				} catch(error) {
					//Print error
					printError(error);
				}
			} else {
				//Print status code error
				printError({message: "There was an error getting profile for " + zipcode + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
			}
		});

	});

	//Connection error
	request.on("error", printError);

}


//Print out message
function printMessage(weather) {
	var city = zipObj["\"\"city\"\""];
	var state = zipObj["\"\"state\"\""];

	city = city.slice(2);
	city = city.slice(0,-2);

	state = state.slice(2);
	state = state.slice(0,-2);

	console.log("Currently the weather in " + city + ", " + state + " is " + weather.currently.summary.toLowerCase() + " and " + Math.round(weather.currently.temperature) + "\xB0 fahrenheit. Have a nice day :)");
}

//Print our error message
function printError(error) {
	console.error(error.message);
}



//make functions available to app
module.exports = {
	getZipCoordinates: getZipCoordinates,
	getWeather: getWeather,
	zipcode: zipcode
}











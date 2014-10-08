var weather = require('./dataModules/weatherUnderground.js');
var db = require('./db');
var cron = require('cron').CronJob;

var jobs = {};
jobs.weather = function(cronPattern) {
    new cron(cronPattern, function(){
        getWeatherData();
    }, null, true, null);
};

module.exports = jobs;


// Jobs
var getWeatherData = function() {
    var complete = function(data) {
        data = data['current_observation'];
        var filteredData = {
            'location' : data['observation_location'],
            'time' : data['observation_time'],
            'weather' : data['weather'],
            'temperature' : data['temperature_string'],
            'humidity' : data['relative_humidity'],
            'wind' : data['wind_string'],
            'feels_like' : data['feelslike_string'],
            'UV' : data['UV']
        };

        db.save.insert("weather_data", filteredData, function() {console.log('Got weather data.');});
    }

    // Get the data from Weather Underground
    var wu = new weather('pws:KCAMURRI9');
    wu.getData(complete);
};
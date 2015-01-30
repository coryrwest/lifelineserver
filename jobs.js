var weather = require('./3rd_party_data/weatherUnderground.js');
var api = require('./data_access/api.js');
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
            'observation_time' : data['observation_time'],
            'weather' : data['weather'],
            'temperature' : data['temperature_string'],
            'humidity' : data['relative_humidity'],
            'wind' : data['wind_string'],
            'feels_like' : data['feelslike_string'],
            'UV' : data['UV']
        };

        api.insert("weather_data", filteredData, function() {console.log('Got weather data.');});
    };

    // Get the data from Weather Underground
    var wu = new weather('pws:KCAMURRI9');
    wu.getData(complete);
};
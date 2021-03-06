function formatDataForGraph(obj, dateRange) {
    var values = [];

    obj = obj.sortBy('date');
    obj = formatDataSetDates(obj, 'date', true);

    for(var i = 0; i <= obj.length - 1; i++) {
        if (obj[i].date != undefined) {
            var date = obj[i].date;
            if(date >= moment().subtract(numberDays, 'days')) {
                date = date.format(smallFormat);
                values.push({y: +obj[i].value, name: date});
            }
        }
    }

    values = normalizeData(values, dateRange);

    return values;
}

function formatWeatherDataForGraph(obj, dateRange) {
    obj = obj.sortBy('createdAt');
    obj = formatDataSetDates(obj, 'createdAt');

    var values = [];
    var weatherByDate = obj.groupBy('date');
    // Get average temp for day
    for(var k = 0; k <= Object.keys(weatherByDate).length - 1; k++) {
        var key = Object.keys(weatherByDate)[k];
        var highestTemp = 0;
        for (var j = 0; j <= weatherByDate[key].length - 1; j++) {
            if (j != 0) {
                if (highestTemp < +formatTemp(weatherByDate[key][j - 1].temperature)) {
                    highestTemp = +formatTemp(weatherByDate[key][j - 1].temperature);
                }
            } else {
                highestTemp = +formatTemp(weatherByDate[key][j].temperature);
            }
        }
        values.push({name: key, y: highestTemp, drilldown: key});
    }

    values = normalizeData(values, dateRange);

    return values;
}

function formatEnergyDataForGraph(obj, dateRange) {
    obj = obj.sortBy('startTime');
    obj = formatDataSetDates(obj, 'startTimeFormatted', false);

    var values = [];
    var energyByDate = obj.groupBy('date');
    // Get total energy for day
    for(var k = 0; k <= Object.keys(energyByDate).length - 1; k++) {
        var key = Object.keys(energyByDate)[k];
        var totalEnergy = 0;
        for (var j = 0; j <= energyByDate[key].length - 1; j++) {
            totalEnergy += +energyByDate[key][j].kWh;
        }
        // round it off
        totalEnergy = Math.round(totalEnergy * 100) / 100;
        // Show warning for missing data
        if (energyByDate[key].length != 24) {
            console.log("Missing data for " + key + ". " + energyByDate[key].length);
        }
        values.push({name: key.replace("-2014", ""), y: totalEnergy});
    }

    values = normalizeData(values, dateRange);

    return values;
}

function formatWeatherDataForDrilldown(obj, dateRange) {
    obj = obj.sortBy('createdAt');
    obj = formatDataSetDates(obj, 'createdAt');

    var values = [];

    var weatherByDate = obj.groupBy('date');

    for(var k = 0; k <= Object.keys(weatherByDate).length - 1; k++) {
        var key = Object.keys(weatherByDate)[k];
        var dayData = [];
        for(var j = 0; j <= weatherByDate[key].length - 1; j++) {
            var time = formatDate(weatherByDate[key][j].createdAt, false, true);
            dayData.push([time, +formatTemp(weatherByDate[key][j].temperature)])
        }

        values.push({id: key, data: dayData});
    }

    values = normalizeData(values, dateRange);

    return values;
}

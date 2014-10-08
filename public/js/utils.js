var numberDays = 14;

function formatDataForGraph(obj, dateRange) {
    var dates = [], values = [];

    obj = obj.sortBy('date');
    obj = formatDataSetDates(obj, 'date');

    for(var i = 0; i <= obj.length - 1; i++) {
        if (obj[i].date != undefined) {
            var date = obj[i].date;
            if(date >= moment().subtract(numberDays, 'days')) {
                date = date.format("M-D");
                dates.push(date);
                values.push({value: obj[i].value, date: date});
            }
        }
    }
    values = values.groupBy('date');
    var newValues = [];
    Object.keys(values).each(function(cur, index) {
        newValues.push({name: cur, y: values[cur].length});
    });

    newValues = normalizeData(newValues, dateRange);

    return newValues;
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

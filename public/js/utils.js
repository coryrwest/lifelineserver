function formatParseDate(date) {
    //return moment(date, moment.ISO_8601).subtract(7, 'h').format('MM-DD');
    return moment(date, "MM-DD-YYYY HH:mma");
}

function formatDataForGraph(obj, objName) {
    obj = obj.sortBy('date');
    var dates = [];
    var values = [];
    for(var i = 0; i <= obj.length - 1; i++) {
        if (obj[i].date != undefined) {
            var date = formatParseDate(obj[i].date);
            if(date >= moment().subtract(15, 'days')) {
                date = date.format("M-D");
                dates.push(date);
                values.push({value: obj[i].value, date: date});
            }
        }
    }
    dates = dates.unique();
    values = values.groupBy('date');
    var newValues = [];
    Object.keys(values).each(function(cur, index) {
        newValues.push([cur, values[cur].length]);
    });

    var graphData = {
        name: objName,
        data: newValues
    };

    return [dates, graphData];
}

function formatWeatherDataForGraph(obj, objName) {
    obj = obj.sortBy('date');
    var dates = [];
    var values = [];
    for(var i = 0; i <= obj.length - 1; i++) {
        obj[i].date = formatParseDate(obj[i].date);
//        if(date >= moment().subtract(15, 'days').format('MM-DD')) {
//            dates.push(date);
//            values.push({value: obj[i].value, date: date});
//        }
    }
    var weatherByDate = obj.groupBy('date');
    // Get average temp for day
    for(var k = 0; k <= Object.keys(weatherByDate).length - 1; k++) {
        var key = Object.keys(weatherByDate)[k];
        var highestTemp;
        for(var j = 0; j <= weatherByDate[key].length - 1; j++) {
            if(j != 0) {
                if (highestTemp < weatherByDate[key][j - 1].temperature.split('.')[0]) {
                    highestTemp = weatherByDate[key][j - 1].temperature.split('.')[0];
                }
            } else {
                highestTemp = weatherByDate[key][j].temperature.split('.')[0];
            }
        }
        values.push([key, +highestTemp]);
    }

    dates = Object.keys(weatherByDate);

    var graphData = {
        name: objName,
        data: values
    };

    return [dates, graphData];
}

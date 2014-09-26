var numberDays = 14;

function formatParseDate(date) {
    return moment(date, "MM-DD-YYYY HH:mma");
}

function formatParseCreateDate(date) {
    return moment(date, moment.ISO_8601).subtract(7, 'h').format('M-D');
}

function getDateRange(range) {
    var dates = [];
    for(var i = 0; i < range; i++) {
        dates.push(moment().subtract(i, 'days').format("M-D"))
    }
    return dates.sortBy();
}

function formatDataForGraph(obj, objName) {
    obj = obj.sortBy('date');
    var dates = [];
    var values = [];
    for(var i = 0; i <= obj.length - 1; i++) {
        if (obj[i].date != undefined) {
            var date = formatParseDate(obj[i].date);
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
        newValues.push([cur, values[cur].length]);
    });

    newValues = normalizeData(newValues, getDateRange(numberDays));

    return newValues;
}

function formatWeatherDataForGraph(obj, objName) {
    obj = obj.sortBy('createdAt');
    var values = [];
    for(var i = 0; i <= obj.length - 1; i++) {
        obj[i].date = formatParseCreateDate(obj[i].createdAt);
    }
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
        values.push([key, highestTemp]);
    }

    values = normalizeData(values, getDateRange(numberDays));

    return values;
}

function formatTemp(temp) {
    // If no . then split on a space.
    if (temp.indexOf('.') != -1) {
        return temp.split('.')[0];
    } else {
        return temp.split(' ')[0];
    }
}

function normalizeData(data, dates) {
    var normalized = dates.map(function(n) {
        var exists = false;
        var j;
        for(j = 0; j <= data.length - 1; j++) {
            if(data[j][0] == n) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            return [n, null];
        } else {
            return data[j];
        }
    });

    return normalized;
}

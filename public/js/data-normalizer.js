function normalizeData(data, dates) {
    if (data[0] == undefined) {
        return;
    }

    var drilldownData = data[0].id != undefined;

    var normalized = dates.map(function(n) {
        var emptyObject = {name: n, y: null};
        var key = 'name';
        var exists = false, j;
        // If drilldown data, we have to
        // return a different empty object
        // and use a different key
        if (drilldownData) {
            emptyObject = {id: n, data: []};
            key = 'id';
        }

        for(j = 0; j <= data.length - 1; j++) {
            if(data[j][key] == n) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            return emptyObject;
        } else {
            return data[j];
        }
    });

    return normalized;
}

function formatTemp(temp) {
    // If no . then split on a space.
    if (temp.indexOf('.') != -1) {
        return temp.split('.')[0];
    } else {
        return temp.split(' ')[0];
    }
}

function generateMinLine(dateRange, minimum) {
    var line = [];
    dateRange.each(function(n) {
        line.push(minimum);
    });
    return line;
}
function formatDataSetDates(data, key) {
    // createdAt will always have data,
    // so no need for null check
    if (key == 'createdAt') {
        for(var i = 0; i <= data.length - 1; i++) {
            data[i].date = formatDate(data[i][key], false, false);
        }
    } else {
        for(var i = 0; i <= data.length - 1; i++) {
            if (data[i][key] != undefined) {
                data[i].date = formatDate(data[i][key], true, false);
            }
        }
    }
    return data;
}

function formatDate(date, returnMoment, asTime) {
    var isCreatedDate = moment(date, moment.ISO_8601).isValid();
    var date;
    // Parse the date to a moment
    if (isCreatedDate) {
        date = moment(date, moment.ISO_8601).subtract(7, 'h');
    } else {
        date =  moment(date, "MM-DD-YYYY HH:mma");
    }

    // Return the moment and do no other processing
    if (returnMoment) {
        return date;
    } else {
        // Format the date
        if (asTime) {
            // Return as time if true no matter
            // what type of date this is
            return date.format('HH:mm');
        } else if (!asTime && isCreatedDate) {
            // Only return formatted if this is
            // a parse created date
            return date.format('M-D');
        } else {
            return date.format('MM-DD-YYYY');
        }
    }
}

function getDateRange(range) {
    var dates = [];
    for(var i = 0; i < range; i++) {
        dates.push(moment().subtract(i, 'days').format("M-D"))
    }
    return dates.sortBy();
}
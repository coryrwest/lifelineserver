function formatDataSetDates(data, key, asMoment) {
    // createdAt will always have data,
    // so no need for null check
    if (key == 'createdAt') {
        for(var i = 0; i <= data.length - 1; i++) {
            data[i].date = formatDate(data[i][key], false, false);
        }
    } else {
        for(var i = 0; i <= data.length - 1; i++) {
            if (data[i][key] != undefined) {
                data[i].date = formatDate(data[i][key], asMoment, false);
            }
        }
    }
    return data;
}

function formatDate(date, returnMoment, asTime) {
    if (date) {
        var isCreatedDate = moment(date, moment.ISO_8601).isValid();
        // Parse the date to a moment
        if (!isCreatedDate) {
            date = moment(date, longFormat);
        } else {
            date = moment(date);
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
                return date.format(smallFormat);
            } else {
                return date.format(medFormat);
            }
        }
    }
    else {
        return moment().format(medFormat);
    }
}

function getDateRange(range) {
    var dates = [];
    for(var i = 0; i < range; i++) {
        dates.push(moment().subtract(i, 'days').format(smallFormat))
    }
    return dates.sortBy();
}
var smallFormat = "M-D";
var medFormat = 'MM-DD-YYYY';
var longFormat = "MM-DD-YYYY HH:mma";
var numberDays = 14;
var end = moment().format(medFormat);
var start = moment().subtract(numberDays, "days").format(medFormat);

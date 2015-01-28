var smallFormat = "M-D";
var medFormat = 'DD-MM-YYYY';
var longFormat = "DD-MM-YYYY HH:mma";
var numberDays = 14;
var end = moment().format(medFormat);
var start = moment().subtract(numberDays, "days").format(medFormat);

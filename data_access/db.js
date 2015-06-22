// https://github.com/shiki/kaiseki
var moment = require('moment-timezone');

var helpers = module.exports = {};
// --- HELPERS ---
helpers.handleError = function(error) {
    if (error != undefined && error != null) {
        console.log(error);
    }
};

helpers.setDefaults = function(object, object_name) {
    // Add date to object
    object.date = object.date || moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
    // Add time to object
    object.time = object.time || moment().tz("America/Los_Angeles").format("HH:mm Z z");
    object.created = object.date + " " + object.time;
    // Set type
    object.type = object_name;
    return object;
};

helpers.stripMetaData = function(object) {
    if (object.isNew != undefined) {
        delete object.isNew;
    }
    return object;
};

helpers.createObjectIfEmpty = function(object) {
    if (object == undefined || object == null) {
        object = {};
    }
    return object;
};

helpers.IsNotNull = function(object) {
    return object != null && object != undefined;
};
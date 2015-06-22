// This class will handle all translation of the request parameters
// to the object that CouchDB is expecting to build the url
var moment = require('moment-timezone');
var today = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
var couch = require('./couchdb');
// helpers
var helpers = require('./db.js');
var api = module.exports = {};

api.getRange = function(object_name, start, end, date, view, suc) {
    var params = {};

    if(start) {
        params.start = start;
    }
    if (end) {
        params.end = end;
    }
    if(params.start == "today") {
        params.start = today;
    }
    if (date) {
        params = {};
        params.date = date;
    }
    if (view) {
        params.view = view;
    }

    try {
        couch.get(object_name, params, suc);
    }
    catch (ex) {
        suc(ex);
    }
};

api.insert = function (object_name, object, suc) {
    // Ensure object existence
    object = helpers.createObjectIfEmpty(object);
    // Set date time and comparator
    object = helpers.setDefaults(object, object_name);
    object = helpers.stripMetaData(object);
    // Check if object has a change property and process accordingly
    if (object.change) {
        object = api.updateValue(object, object.change);
    }

    try {
        couch.insert(object_name, object, suc);
    }
    catch (ex) {
        suc(ex);
    }
};

api.insertCollection = function (object_name, objects, suc) {
    for(var i = 0; i < objects.length; i++) {
        // Ensure object existence
        objects[i] = helpers.createObjectIfEmpty(objects[i]);
        // Set date time and comparator
        objects[i] = helpers.setDefaults(objects[i], object_name);
        objects[i] = helpers.stripMetaData(objects[i]);
        // Check if object has a change property and process accordingly
        if (objects[i].change) {
            objects[i] = api.updateValue(objects[i], objects[i].change);
        }
    }

    try {
        couch.insertCollection(object_name, objects, suc);
    }
    catch (ex) {
        suc(ex);
    }
};

api.update = function(object_name, id, object, body, suc) {
    // Check if this is a 'change' object
    var isChangeObject = false;
    if (object.change) {
        isChangeObject = true;
    }

    // Parse id to check if it is a date
    var idIsDate = id != undefined && moment(id).isValid();

    // Do a GET to get the existing id if we don't have it
    if(idIsDate || isChangeObject) {
        // This is not an actual object we need to run the GET
        if (id) {
            params = {};
            params.date = id;
        }

        try {
            couch.get(object_name, params, success);
        }
        catch (ex) {
            success(ex);
        }

        function success(data) {
            if(data == null) {
                data = [];
                // Ensure object existence
                data.push(helpers.createObjectIfEmpty(null));
                data[0].date = object.date;
                // Set date time and comparator
                data[0] = helpers.setDefaults(data[0], object_name);
                var updated = api.updateValue(data[0], object.change);
                // Handle special object cases
                updated = handleSpecialCases(updated);
                couch.insert(object_name, updated, suc);
            } else {
                var updated = api.updateValue(data[0], object.change);
                // Handle special object cases
                updated = handleSpecialCases(updated);
                couch.update(object_name, updated, suc);
            }
        }
    } else {
        // Do update as normal
        try {
            couch.get(object_name, {date: today}, normalSuc);
        }
        catch (ex) {
            normalSuc(ex);
        }

        function normalSuc(data) {
            if(data == null) {
                data = [];
                // Ensure object existence
                data.push(helpers.createObjectIfEmpty(null));
                // Set date time and comparator
                data[0] = helpers.setDefaults(data[0], object_name);
                couch.insert(object_name, data[0], suc);
            } else {
                couch.update(object_name, data[0], suc);
            }
        }
    }
};

api.updateValue = function(object, change) {
    // check existence and convert to int
    object.value = +object.value || 0;

    if (change.indexOf("+") != -1) {
        var num = change.substr(1, change.length);
        if (num.length > 0) {
            object.value = object.value + +num;
        } else {
            object.value = object.value + 1;
        }
    } else if (object.value != 0 && change.indexOf("-") != -1) {
        var num = change.substr(1, change.length);
        if (num.length > 0) {
            var final = object.value - +num;
            if (final < 0) {
                object.value = 0;
            } else {
                object.value = final;
            }
        } else {
            object.value = object.value - 1;
        }
    } else {
        object.value = change;
    }

    // Convert to string
    object.value = object.value.toString();

    if(object.change) {
        delete object.change;
    }

    return object;
};

api.handleResponse = function(body) {
    var response = {
        isError: false,
        message: '',
        data: {}
    };

    if(body.error) {
        response.isError = true;
        response.message = body.error + ': ' + body.reason;
        response.data = body;
    } else {
        if(body instanceof Array) {
            response.data = {
                itemCount: body.length,
                array: body
            };
        } else {
            response.data = body;
        }
    }

    return response;
};

var handleSpecialCases = function(object) {
    if (object && object.type && object.value) {
        if (object.type == 'sick') {
            object.value = '1';
        }
    }
    return object;
};
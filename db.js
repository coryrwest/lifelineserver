// https://github.com/shiki/kaiseki
var moment = require('moment-timezone');
// parse database
var parse = require('kaiseki');
var db = new parse("JSBJdPtSWQFxEg6jyX8UcNYh9dmXPPfqgSM2wZsu", "05ewwHMwWu88RAxIfKZ9XeaHLhUMz3sEfvHNDegA");
var today = moment().tz("America/Los_Angeles").format("MM-DD-YYYY");

// -----------
// --- GET ---
// -----------
var get = exports.get = {};
get.list = function(object_name, name, limit, success) {
    if(limit == undefined || limit == null) {
        limit = 50;
    }
    var params = {
        order: '-date',
        limit: limit
        //where: { dateComparator: {$gte: moment().subtract(20, 'd').format("X"), $lte: moment().format("X")} }
    };

    get.list(object_name, params, success);
};
get.list = function(object_name, params, success) {
    db.getObjects(object_name, params, function(err, res, body, suc){
        success(body);
    });
};
get.single = function(object_name, params, success) {
    if(params == null) {
        params = {
            where: {date: today}
        };
    }

    if (params instanceof Object) {
        db.getObject(object_name, null, params, function(err, res, body, suc){
            success(body);
        });
    } else {
        db.getObject(object_name, id, null, function(err, res, body, suc){
            success(body);
        });
    }
};

// ------------
// --- SAVE ---
// ------------
var save = exports.save = {};
save.insert = function(object_name, object, success) {
<<<<<<< Updated upstream
    // Add date to object
    object.date = moment(object.date).tz("America/Los_Angeles").format("MM-DD-YYYY HH:mma z")
        || moment().tz("America/Los_Angeles").format("MM-DD-YYYY HH:mma z");
    object.dateComparator = +object.dateComparator || +moment().format('X');
=======
    // Set date time and comparator
    object = setDateTime(object);
>>>>>>> Stashed changes
    db.createObject(object_name, object, function(err, res, body, suc) {
        if(success) {
            success(body);
        }
    });
};
save.insertCollection = function(object_name, objects, success) {
    // Add date to objects
    for(var i = 0; i <= objects.length - 1; i++) {
        objects[i] = setDateTime(objects[i]);
    }
    db.createObjects(object_name, objects, function(err, res, body, suc) {
        if(success) {
            success(body);
        }
    });
};
save.update = function(object_name, object, success) {
    db.updateObject(object_name, object.objectId, object, function(err, res, body, suc) {
        success(body);
    });
};

// --------------
// --- REMOVE ---
// --------------
var remove = exports.remove = {};
remove.single = function(object_name, id, success) {
    db.deleteObject(object_name, id, function(err, res, body, suc){
        if(success){
            success(body);
        } else {
            fail(body);
        }
    });
};

// --- HELPERS ---
function setDateTime(object) {
    // Add date to object
    object.date = object.date || moment().tz("America/Los_Angeles").format("MM-DD-YYYY");
    // Add time to object
    object.time = object.time || moment().tz("America/Los_Angeles").format("HH:mma z");
    // Add date comparator to object
    object.dateComparator = +object.dateComparator || +moment().format('X');
    return object;
}

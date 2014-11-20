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
get.list = function(object_name, params, success) {
    db.getObjects(object_name, params, function(err, res, body, suc){
        success(body);
    });
};
get.single = function(object_name, params, success) {
    get.singleOrNew(object_name, params, success, false)
};

get.singleOrNew = function(object_name, params, success, create_new) {
    // default create_new
    if (create_new == undefined) {
        create_new = true;
    }

    if(params == null) {
        params = {
            where: {date: today}
        };
    }

    // If no object create one
    function responseSuccess(object_name, data, success, create_new) {
        if (create_new) {
            if ((data == undefined) || (data.code == undefined) || (data.code != undefined && data.code == 101)) {
                save.insert(object_name, data, function(data){success(data);});
            } else {
                success(data);
            }
        } else {
            success(data);
        }
    }

    if (params instanceof Object) {
        db.getObjects(object_name, params, function(err, res, body, suc){
            if (body[0] == undefined && params != undefined && params.where != undefined) {
                body = {
                    date: params.where.date
                };
            } else {
                body = body[0];
            }

            responseSuccess(object_name, body, success, create_new);
        });
    } else {
        db.getObject(object_name, id, null, function(err, res, body, suc){
            responseSuccess(object_name, body, success, create_new);
        });
    }
};

// ------------
// --- SAVE ---
// ------------
var save = exports.save = {};
save.insert = function(object_name, object, success) {
    // Ensure object existence
    object = createObjectIfEmpty(object);
    // Set date time and comparator
    object = setDateTime(object);
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

function createObjectIfEmpty(object) {
    if (object == undefined || object == null) {
        object = {};
    }
    return object;
}

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
    get.singleOrNew(object_name, params, success, false);
};
get.singleOrNew = function(object_name, params, success, create_new) {
    // default create_new
    if (create_new == undefined) {
        create_new = true;
    }

    // if params is null get the item for today
    if(params == null) {
        params = {
            where: {date: today}
        };
    }

    var responseSuccess;

    if (params instanceof Object) {
        db.getObjects(object_name, params, function(err, res, body, suc){
            handleError(err);
            responseSuccess(object_name, body[0], success, create_new);
        });
    } else {
        db.getObject(object_name, params, null, function(err, res, body, suc){
            handleError(err);
            responseSuccess(object_name, body, success, create_new);
        });
    }

    // If no object create one
    responseSuccess = function(object_name, data, success, create_new) {
        if ((data == undefined || data == null) ||
            (create_new && data != undefined && data.code != undefined && data.code == 101)) {
            save.insert(object_name, null, function (data) {
                success(data);
            });
        } else {
            success(data);
        }
    }
};

// ------------
// --- SAVE ---
// ------------
var save = exports.save = {};
save.insert = function(object_name, object, success) {
    // Ensure object existence
    object = createObjectIfEmpty(object);
    // Set type
    object = setObjectType(object, object_name);
    // Set date time and comparator
    object = setDefaults(object);
    db.createObject(object_name, object, function(err, res, body, suc) {
        if(success) {
            body.isNew = true;
            success(body);
        }
    });
};
save.insertCollection = function(object_name, objects, success) {
    // Add date to objects
    for(var i = 0; i <= objects.length - 1; i++) {
        objects[i] = createObjectIfEmpty(objects[i]);
        objects[i] = setDefaults(objects[i]);
    }
    db.createObjects(object_name, objects, function(err, res, body, suc) {
        if(success) {
            for(var i = 0; i <= body.length - 1; i++) {
                body[i].isNew = true;
            }
            success(body);
        }
    });
};
save.update = function(object_name, object, success) {
    db.updateObject(object_name, object.objectId, object, function(err, res, body, suc) {
        success(body);
    });
};
save.updateCollection = function(object_name, objects, success) {
    db.updateObjects(object_name, objects, function(err, res, body, suc) {
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
function handleError(error) {
    if (error != undefined && error != null) {
        console.log(error);
    }
}

function setDefaults(object) {
    // Add date to object
    object.date = object.date || moment().tz("America/Los_Angeles").format("MM-DD-YYYY");
    // Add time to object
    object.time = object.time || moment().tz("America/Los_Angeles").format("HH:mma z");
    // Add date comparator to object
    object.dateComparator = +object.dateComparator || +moment().format('X');
    // Set value
    if (object.objectType == "counter") {
        object.value =  object.value || "0";
    }
    return object;
}

function createObjectIfEmpty(object) {
    if (object == undefined || object == null) {
        object = {};
    }
    return object;
}

function setObjectType(object, name) {
    switch(name) {
        case "water":
        case "pick":
        case "sore":
            object.objectType = "counter";
            break;
        case "sick":
            object.objectType = "onceaday";
            break;
        case "left_house":
        case "dailyNotes":
            object.objectType = "note";
            break;
        default:
            object.objectType = "custom";
            break;
    }
    return object;
}


// -----------------------
// --- DATA NORMALIZER ---
// -----------------------
//function normalize() {
//    var params = {
//        limit: 100,
//        order: '-date',
//        where: { dateComparator: {$lte: 1414296333} }
//    };
//
//    var success = function(data) {
//        for (var i = 0; i <= data.length - 1; i++) {
//            if (data[i].time == undefined) {
//                data[i].time = data[i].date.split("2014")[1].substr(1);
//                data[i].date = data[i].date.split("2014")[0] + "2014";
//            }
//
//            save.update("sore", data[i], null);
//        }
//    };
//
//    get.list("sore", params, success);
//};
//normalize();
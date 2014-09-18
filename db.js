// https://github.com/shiki/kaiseki

// parse database
var parse = require('kaiseki');
var db = new parse("JSBJdPtSWQFxEg6jyX8UcNYh9dmXPPfqgSM2wZsu", "05ewwHMwWu88RAxIfKZ9XeaHLhUMz3sEfvHNDegA");

var get = exports.get = {};
get.list = function(object_name, name, success) {
    var params = {
        limit: 100,
        order: '-createdAt'
    };

    db.getObjects(object_name, params, function(err, res, body, suc){
        success(body);
    });
};
get.single = function(object_name, id, success) {
    db.getObject(object_name, id, function(err, res, body, suc){
        success(body);
    });
};

var save = exports.save = {};
save.insert = function(object_name, object, success) {
    // Add date to object
    var date = new Date();
    object.insertDate = date.toISOString();
    db.createObject(object_name, object, function(err, res, body, suc) {
        if(success) {
            success(body);
        }
    });
};
save.update = function(object_name, id, object, success) {
    db.updateObject(object_name, id, object, function(err, res, body, suc) {
        success(body);
    });
};

var remove = exports.delete = {};
remove.single = function(object_name, id, success) {
    db.deleteObject(object_name, id, function(err, res, body, suc){
        if(success){
            success(body);
        } else {
            fail(body);
        }
    });
};
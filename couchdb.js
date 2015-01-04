// https://github.com/shiki/kaiseki
var moment = require('moment-timezone');
// couchdb
var request = require('request').defaults({jar: true});
request.debug = true;
var root = 'https://lifeline1.iriscouch.com:6984/';

var dal = module.exports = {};

function authenticate(authed) {
    request({
        method: 'POST',
        uri: root + '_session',
        form: {name:'coryrwest',password:'6OrhBBc3FP1ZYJ4'}
    }, function(err,httpResponse,body){
        authed();
    });
}

// -----------
// --- GET ---
// -----------
dal.get = function(object_name, params, success) {
    var url = root + getDBName(object_name) + "/_design/base/_view/byID";

    // Handle params
    if(params.start) {
        url += "?startkey=[\"" + params.start + "\",\"" + object_name + "\"]";
    } else if(params.date) {
        url += "?key=[\"" + params.date + "\",\"" + object_name + "\"]";
    }

    request.get(url, function(err, res, body) {
        if(err) {
            throw err;
        }

        var result = [], json = JSON.parse(body);
        for(var i = 0; i <= json.rows.length - 1; i++) {
            result.push(json.rows[i].value);
        }

        if (result.length == 0) {
            result = null;
        }

        success(result);
    });
};

// ------------
// --- SAVE ---
// ------------
dal.insert = function(object_name, object, success) {
    var url = root + getDBName(object_name);

    request.post({
        url: url,
        body: object,
        json: true
    }, function(err, res, body) {
        if(err) {
            throw err;
        }

//        var result = [], json = JSON.parse(body);
//        for(var i = 0; i <= json.rows.length - 1; i++) {
//            result.push(json.rows[i].value);
//        }
        success(body);
    });
};
dal.insertCollection = function(object_name, objects, success) {
    var url = root + getDBName(object_name) + "/_bulk_docs";

    var postData = { "docs" : objects };

    request.post({
        url: url,
        body: postData,
        json: true
    }, function(err, res, body) {
        if(err) {
            throw err;
        }

        success(body);
    });
};
dal.update = function(object_name, object, success) {
    var url = root + getDBName(object_name);

    authenticate(function() {
        request({
            method: 'PUT',
            uri: url + '/' + object._id,
            body: object,
            json: true
        }, function(err, res, body) {
            if(err) {
                throw err;
            }

//            var result = [], json = JSON.parse(body);
//            for(var i = 0; i <= json.rows.length - 1; i++) {
//                result.push(json.rows[i].value);
//            }
            success(body);
        });
    });
};
dal.updateCollection = function(object_name, objects, success) {
};

// --------------
// --- REMOVE ---
// --------------
dal.remove = function(object_name, id, rev, success) {
    var url = root + getDBName(object_name) + "/" + id + "?rev=" + rev;

    request.del(url, function(err, res, body) {
        if(err) {
            throw err;
        }

        var json = JSON.parse(body);
        success(json.ok);
    });
};


var convertDate = function(date) {
    return new Date(date).toISOString().splice(1, 10);
};
var getDBName = function(object) {
    switch(object) {
        case "water":
        case "pick":
        case "sore":
            return "counter_data";
        case "sick":
            return "onceaday_data";
        case "left_house":
        case "daily_notes":
            return "note_data";
        case "weather_data":
            return "weather_data";
        default:
            return "custom_data";
    }
};

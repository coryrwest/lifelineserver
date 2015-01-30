// https://github.com/shiki/kaiseki
var moment = require('moment-timezone');
// couchdb
var request = require('request').defaults({jar: true});
//var j = request.jar();
//request.defaults({jar: true});
request.debug = true;
var root = process.env.ROOT || 'https://lifeline1.iriscouch.com:6984/';

var dal = module.exports = {};

function authenticate(authed) {
    request({
        method: 'POST',
        uri: root + '_session',
        form: {name:'reader',password:process.env.DBPASSWORD}
    }, function(err,httpResponse,body){
        authed();
    });
}

// -----------
// --- GET ---
// -----------
dal.get = function(object_name, params, success) {
    var type = getDBName(object_name), url = root + type;

    // Handle params
    if(params.view) {
        url = url + "/_design/" + params.view;
    } else {
        url = url + "/_design/base/_view/byID";
    }
    if (type == 'counter_data') {
        if(params.start) {
            url += "?startkey=[\"" + object_name + "\",\"" + params.start + "\"]";
        } else if(params.date) {
            url += "?key=[\"" + object_name + "\",\"" + params.date + "\"]";
        }
    } else {
        if(params.start) {
            url += "?startkey=\"" + params.start + "\"";
        } else if(params.date) {
            url += "?key=\"" + params.date + "\"";
        }
    }

    authenticate(function() {
            request.get({url: url}, function(err, res, body) {
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
        }
    );
};

// ------------
// --- SAVE ---
// ------------
dal.insert = function(object_name, object, success) {
    var url = root + getDBName(object_name);

    authenticate(request.post({
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
        })
    );
};
dal.insertCollection = function(object_name, objects, success) {
    var url = root + getDBName(object_name) + "/_bulk_docs";

    var postData = { "docs" : objects };

    authenticate(request.post({
            url: url,
            body: postData,
            json: true
        }, function(err, res, body) {
            if(err) {
                throw err;
            }

            success(body);
        })
    );
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

    authenticate(request.del(url, function(err, res, body) {
            if(err) {
                throw err;
            }

            var json = JSON.parse(body);
            success(json.ok);
        })
    );
};

var convertDate = function(date) {
    return new Date(date).toISOString().splice(1, 10);
};
var getDBName = function(object) {
    switch(object) {
        case "water":
        case "pick":
        case "sore":
        case "sick":
            return "counter_data";
        case "weather_data":
            return "weather_data";
        case "bank_data":
            return "bank_data";
        case "energy_data":
            return "energy_data";
        default:
            return "note_data";
    }
};

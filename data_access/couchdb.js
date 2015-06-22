// https://github.com/shiki/kaiseki
var moment = require('moment-timezone');
var today = moment().tz("America/Los_Angeles").format("YYYY-MM-DD");
var time = moment().tz("America/Los_Angeles").format('HH:mm:ss');
// couchdb
var request = require('request').defaults({jar: true});
//var j = request.jar();
//request.defaults({jar: true});
request.debug = true;
var root = process.env.ROOT || 'https://coryrwest.cloudant.com/';
var authCookie = null;

var dal = module.exports = {};

function authenticate(authed) {
    var data = {name:process.env.DBUSER,password:process.env.DBPASSWORD};
    if(authCookie == null) {
        request({
            method: 'POST',
            uri: root + '_session',
            form: data
        }, function (err, res, body) {
            if (err == null) {
                console.log('Authenticated');
                if (res.headers['set-cookie']) {
                    authCookie = res.headers['set-cookie'][0];
                }
                authed();
            } else {
                throw err;
            }
        });
    } else {
        authed();
    }
}

// -----------
// --- GET ---
// -----------
dal.get = function(object_name, params, success) {
    var type = getDBName(object_name), url = root + type;

    // Handle params
    if(params.view) {
        url = url + "/_design/base/_view/" + params.view;
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
            url += "?startkey=\"" + params.start + "\"&descending=true";
        } else if(params.date) {
            url += "?key=\"" + params.date + "\"";
        }
    }

    authenticate(function() {
            request.get({url: url}, function(err, res, body) {
                var result = [], json = JSON.parse(body);

                if(err) {
                    throw err;
                }
                if (json.error) {
                    throw json.error;
                }

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

    authenticate(function() {
        request.post({
            url: url,
            body: object,
            json: true,
            headers: {
                cookie: authCookie
            }
        }, function(err, res, body) {
            if(err) {
                throw err;
            }
            // log it
            if(object_name != 'log' && object_name != 'test') {
                log(object_name + ' saved.', 'info', object);
            }

            success(body);
        })
    });
};
dal.insertCollection = function(object_name, objects, success) {
    var url = root + getDBName(object_name) + "/_bulk_docs";

    var postData = { "docs" : objects };

    authenticate(function() {
            request.post({
                url: url,
                body: postData,
                json: true,
                headers: {
                    cookie: authCookie
                }
            }, function(err, res, body) {
                if(err) {
                    throw err;
                }
                // log it
                if(object_name != 'log' && object_name != 'test') {
                    log(objects.length + ' ' + object_name + '\'s saved.', 'info', objects);
                }

                success(body);
            })
        });
};
dal.update = function(object_name, object, success) {
    if(!object._id) {
        throw new Error('The objects _id was undefined.');
    }

    var url = root + getDBName(object_name);

    authenticate(function() {
        request({
            method: 'PUT',
            uri: url + '/' + object._id,
            body: object,
            json: true,
            headers: {
                cookie: authCookie
            }
        }, function(err, res, body) {
            if(err) {
                throw err;
            }
            // log it
            if(object_name != 'log' && object_name != 'test') {
                log(object_name + ' updated.', 'info', object);
            }

            success(body);
        });
    });
};
dal.updateCollection = function(object_name, objects, success) {
};
var log = function(message, level, object) {
    var logItem = {
        message: message,
        date: today,
        time: time,
        data: object,
        level: level
    };

    var url = root + 'log_data';

    authenticate(function() {
        request.post({
            url: url,
            body: logItem,
            json: true,
            headers: {
                cookie: authCookie
            }
        }, function(err, res, body) {
            if(err) {
                throw err;
            }
        })
    });
};
// --------------
// --- REMOVE ---
// --------------
dal.remove = function(object_name, id, rev, success) {
    var url = root + getDBName(object_name) + "/" + id + "?rev=" + rev;

    authenticate(function() {
        request.del(url, function(err, res, body) {
            if(err) {
                throw err;
            }
            // log it
            if(object_name != 'log' && object_name != 'test') {
                logger.saveEntry(object_name + ' removed.', 'info', {id: id, rev: rev});
            }

            var json = JSON.parse(body);
            success(json.ok);
        })
    });
};

var convertDate = function(date) {
    return new Date(date).toISOString().splice(1, 10);
};
var getDBName = function(object) {
    switch(object) {
        case 'water':
        case 'pick':
        case 'sore':
        case 'sick':
            return 'counter_data';
        case 'weather_data':
            return 'weather_data';
        case 'bank_data':
            return 'bank_data';
        case 'energy_data':
            return 'energy_data';
        case 'sleep_data':
            return 'sleep_data';
        case 'test':
            return 'test_db';
        case 'log':
            return 'log_data';
        default:
            return 'counter_data';
    }
};

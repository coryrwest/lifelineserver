var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment-timezone');
var today = moment().tz("America/Los_Angeles").format("MM-DD-YYYY");

router.get('/:object/:limit', function(req, res) {
    var success = function(data) {
        res.json(200, data);
    };

    var params = {
        order: '-date',
        limit: req.params.limit
    };

    db.get.list(req.params.object, params, success);
});

router.get('/:object/single/:id', function(req, res) {
    var id = req.params.id, params;

    var success = function(data) {
        res.json(200, data);
    };

    if (id == "today") {
        params = {
            where : { date: today }
        }
    } else {
        params = {
            where : { objectId: id }
        }
    }

    db.get.single(req.params.object, params, success);
});

router.get('/:object/date/:date', function(req, res) {
    var date = req.params.date;
    var params = {
        where: { date: date }
    };

    var getSuccess = function(returnedData) {
        res.json(200, returnedData);
    };

    // Get existing first
    db.get.list(req.params.object, params, getSuccess);
});

router.put('/:object', function(req, res) {
    var success = function(data) {
        res.json(200, data);
    };
    var data = req.body;

    db.save.update(req.params.object, data, success);
});

router.post('/:object/counter', function(req, res) {
    var change = req.body.change;
    var object = req.params.object;
    var getSuccess = function(data) {
        // now that we have the object, update it
        data = updateValue(data, change);
        // save the object
        var createSuccess = function(data) {
            res.json(200, data);
        };
        db.save.update(object, data, createSuccess);
    };

    // get the object to update
    var date = req.body.date;
    var params = {
        where: { date: date }
    };
    // If date is today, null params
    if (date == "today" || date == undefined || date == null) {
        params = null;
    }
    // Get existing first
    db.get.singleOrNew(req.params.object, params, getSuccess);
});

router.post('/:object', function(req, res) {
    var createSuccess = function(data) {
        res.json(200, data);
    };
    var data = req.body;
    db.save.insert(req.params.object, data, createSuccess);
});

router.post('/collection/:object', function(req, res) {
    var createSuccess = function(data) {
        res.json(200, data);
    };
    var data = req.body;
    db.save.insertCollection(req.params.object, data, createSuccess);
});

module.exports = router;

function updateValue(data, change) {
    // check existence and convert to int
    data.value = +data.value || 0;

    if (change.indexOf("+") != -1) {
        var num = change.substr(1, change.length);
        if (num.length > 0) {
            data.value = data.value + +num;
        } else {
            data.value = data.value + 1;
        }
    } else if (data.value != 0 && change.indexOf("-")) {
        var num = change.substr(1, change.length);
        if (num.length > 0) {
            var final = data.value - +num;
            if (final < 0) {
                data.value = 0;
            } else {
                data.value = final;
            }
        } else {
            data.value = data.value - 1;
        }
    }

    // Convert to string
    data.value = data.value.toString();

    return data;
}
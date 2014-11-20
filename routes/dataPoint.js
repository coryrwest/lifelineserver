var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment-timezone');
var today = moment().tz("America/Los_Angeles").format("MM-DD-YYYY");

router.get('/:object/range/:start/:end', function(req, res) {
    var start = req.params.start, end = req.params.end;
    var success = function(data) {
        res.json(200, data);
    };

    // check params
    if (start == "today") {
        start = today;
    }

    var params = {
        order: '-date',
        limit: 300,
        where: { date: { $gte:start, $lte:end } }
    };

    db.get.list(req.params.object, params, success);
});

router.get('/:object/single/:id', function(req, res) {
    var id = req.params.id, params;
    var object = req.params.object;

    var success = function(data) {
        res.json(200, data);
    };

    if (id == "today") {
        params = {
            where : { date: today }
        };
    } else if (moment(id).isValid()) {
        params = {
            where: { date: id }
        };
    } else {
        params = id;
    }

    db.get.singleOrNew(object, params, success, true);
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
    var date = req.body.date;

    var getSuccess = function(data) {
        // now that we have the object, update it
        data = updateValue(data, change);
        var createSuccess = function(data) {
            res.json(200, data);
        };
        // save the object
        db.save.update(object, data, createSuccess);
    };

    // If date is today, no params
    if (date != undefined && date != null) {
        var params = {
            where: { date: date }
        };
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

router.post('/:object/collection', function(req, res) {
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
    } else if (data.value != 0 && change.indexOf("-") != -1) {
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
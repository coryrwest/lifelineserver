var express = require('express');
var router = express.Router();
var api = require('../data_access/api.js');
var moment = require('moment-timezone');

router.get('/:object', function(req, res) {
    var start = req.query.start, end = req.query.end, date = req.query.date, view = req.query.view;

    var suc = function(data) {
        res.json(200, data);
    };

    api.getRange(req.params.object, start, end, date, view, suc);
});

router.put('/:object', function(req, res) {
    var date = req.body.date, change = req.body.change;

    var success = function(data) {
        if (data.ok) {
            res.json(200, data);
        } else {
            res.json(500, "There was an error updating. " + Json.stringify(data));
        }
    };

    api.update(req.params.object, date, {date: date, change: change}, req.body, success);
});

router.post('/:object', function(req, res) {
    var data = req.body;

    var success = function(data) {
        if (data.ok) {
            res.json(200, data);
        } else {
            res.json(500, "There was an error inserting. " + Json.stringify(data));
        }
    };

    api.insert(req.params.object, data, success);
});

router.post('/:object/collection', function(req, res) {
    var success = function(data) {
        var status = {allOk: true};
        for(var i = 0; i < data.length; i++) {
            if (!data[i].ok) {
                status.allOk = false;
                break;
            }
        }

        if(status.allOk) {
            res.json(200, data);
        } else {
            res.json(500, "There was an error inserting. " + Json.stringify(data));
        }
    };

    var data = req.body;
    api.insertCollection(req.params.object, data, success);
});

module.exports = router;
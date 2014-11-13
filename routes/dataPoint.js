var express = require('express');
var router = express.Router();
var db = require('../db');
var moment = require('moment-timezone');
var today = moment().tz("America/Los_Angeles").format("MM-DD-YYYY");

router.get('/:object/:limit', function(req, res) {
    var success = function(data) {
        res.json(200, data);
    };
    db.get.list(req.params.object, null, req.params.limit, success);
});

router.get('/:object/single/:id', function(req, res) {
    var id = req.params.id;
    var success = function(data) {
        res.json(200, data);
    };
    db.get.single(req.params.object, id, success);
});

router.get('/:object/counter/:date/:change', function(req, res) {
    var change = req.params.change;
    var getSuccess = function(data) {
        // now that we have the object, update it
        if (change == "+") {
            data.value = data.value++;
        } else {
            data.value = data.value--;
        }
        // save the object
    };

    // get the object to update
    var date = req.params.date;
    var params = {
        where: { date: date }
    };
    // If date is today, null params
    if (date == today) {
        params = null;
    }
    // Get existing first
    db.get.single(req.params.object, params, getSuccess);
});

router.put('/:object/:date', function(req, res) {
    var date = req.params.date;
    var params = {
        where: { date: date }
    };

    var getSuccess = function(returnedData) {
        var createSuccess = function(data) {
            res.json(200, data);
        };
        db.save.update(req.params.object, returnedData, createSuccess);
    };

    // Get existing first
    db.get.list(req.params.object, params, getSuccess);
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

function getByDate() {

}
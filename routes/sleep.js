var express = require('express');
var router = express.Router();
var api = require('../data_access/api.js');
var moment = require('moment-timezone');
var categoriesList = require('../categories.json');
var request = require('request');
var sugar = require('sugar');
var fastcsv = require('fast-csv');

/**
 * @api {post} /sleep Post sleep data array
 * @apiName PostSleepDataArray
 * @apiGroup Sleep Data
 *
 * @apiParam {Object} objectBody JSON body of the sleep data array to save.
 */
router.post('/', function(req, res) {
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
            res.json(500, "There was an error inserting. " + JSON.stringify(data));
        }
    };

    var csvFile = req.body;

    // Load the csv from the body
    try {
        fastcsv.fromString(csvFile, {headers:true})
            .on('data', function(data) {
                translateCsvRow(data);
            })
            .on('end', function() {
                res.json(200, "Sleep data uploaded successfully.");
            });
    } catch (ex) {
        res.json(500, 'An error occurred when saving sleep data. ' + ex);
    }
});

module.exports = router;

var translateCsvRow = function(row) {
};
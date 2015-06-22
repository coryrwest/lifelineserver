var express = require('express');
var router = express.Router();
var api = require('../data_access/api.js');
var moment = require('moment-timezone');
var request = require('request');
var sugar = require('sugar');
var fastcsv = require('fast-csv');

var sleepData = [];

/**
 * @api {post} /sleep Post sleep data array
 * @apiName PostSleepDataArray
 * @apiGroup Sleep Data
 *
 * @apiParam {Object} objectBody JSON body of the sleep data array to save.
 */
router.post('/', function(req, res) {
    var success = function(data) {
        var resp = api.handleResponse(data);

        if(!resp.isError) {
            var message = 'Sleep data uploaded successfully.';
            if(resp.data.itemCount) message += message + ' Items: ' + resp.data.itemCount;
            res.json(200, message);
        } else {
            res.json(500, "There was an error. Ahh! " + resp.message);
        }
    };

    var csvFile = req.body;

    // Load the csv from the body
    try {
        fastcsv.fromString(csvFile, {ignoreEmpty:true})
            .on('data', function(data) {
                buildSleepData(data);
            })
            .on('end', function() {
                api.insertCollection('sleep_data', sleepData, success);
            });
    } catch (ex) {
        res.json(500, 'An error occurred when building and translating sleep data. ' + ex);
    }
});

module.exports = router;

var lineNumber = 1;
var tempRows = [];
var buildSleepData = function(dataRow) {
    // Only take every first and second row.
    // Ignore every third row, its junk data.
    if(lineNumber % 3 != 0) {
        // Clear temp rows if we have two items.
        // This means we already processed one row.
        if(tempRows.length == 2) {
            tempRows = [];
        }

        tempRows.push(dataRow);

        // Check tempRow length again, do we have enough data?
        if(tempRows.length == 2) {
            var sleepPoint = {
                data: {},
                events: {}
            };
            // Combine arrays to make data matching easier
            var combinedArray = [];
            for (var i = 0; i < tempRows[0].length; i++) {
                combinedArray[i] = [tempRows[0][i], tempRows[1][i]];
            }

            for(var i in combinedArray) {
                var row = combinedArray[i];
                // Set up text keys. ID, Timezone, etc.
                if(/^[a-z]+$/i.test(row[0]) && row[0] != 'Event') {
                    sleepPoint[row[0]] = row[1];
                }
                // This is the actual sleep measurement
                else if (/\d+$/.test(row[0])) {
                    sleepPoint.data[row[0]] = row[1];
                }
                // Events for cycle start and end, and alarm.
                else if (row[0] == 'Event') {
                    var time = row[1].split('-')[1];
                    var event = row[1].split('-')[0];
                    sleepPoint.events[time] = event;
                }
            }

            // Aggregate all sleep data
            sleepData.push(sleepPoint);
        }
    }

    lineNumber++;
};
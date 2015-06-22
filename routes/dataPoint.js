var express = require('express');
var router = express.Router();
var api = require('../data_access/api.js');
var moment = require('moment-timezone');

/**
 * @api {get} /data/:object Get object data
 * @apiName GetObject
 * @apiGroup DataPoint
 *
 * @apiParam {String} object Name of object to get.
 * @apiParam {String} start Query string. Start date of range to get.
 * @apiParam {String} end Query string. End data of range to get.
 * @apiParam {String} date Query string. Date of objects to get.
 * @apiParam {String} view Query string. View to use when getting.
 */
router.get('/:object', function(req, res) {
    var start = req.query.start, end = req.query.end, date = req.query.date, view = req.query.view;
    var limit = req.query.limit;

    var suc = function(data) {
        res.json(200, data);
    };

    api.getRange(req.params.object, start, end, date, view, limit, suc);
});

/**
 * @api {put} /data/:object Put object data
 * @apiName PutObject
 * @apiGroup DataPoint
 *
 * @apiParam {String} object Name of object to update.
 * @apiParam {String} date Query string. Date of object to update.
 * @apiParam {String} change Query string. Change in object to update.
 */
router.put('/:object', function(req, res) {
    var date = req.body.date, change = req.body.change;

    var success = function(data) {
        if (data.ok) {
            res.json(200, data);
        } else {
            res.json(500, "There was an error updating. " + JSON.stringify(data));
        }
    };

    api.update(req.params.object, date, {date: date, change: change}, req.body, success);
});

/**
 * @api {post} /data/:object Post object data
 * @apiName PostObject
 * @apiGroup DataPoint
 *
 * @apiParam {String} object Name of object to save.
 * @apiParam {Object} objectBody JSON body of the object to save.
 */
router.post('/:object', function(req, res) {
    var data = req.body;

    var success = function(data) {
        if (data.ok) {
            res.json(200, data);
        } else {
            res.json(500, "There was an error inserting. " + JSON.stringify(data));
        }
    };

    api.insert(req.params.object, data, success);
});

/**
 * @api {post} /data/:object/collection Post object data collection
 * @apiName PostObjectCollection
 * @apiGroup DataPoint
 *
 * @apiParam {String} object Name of object collection to post.
 * @apiParam {Object} objectBody JSON body of the object array to post.
 */
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
            res.json(500, "There was an error inserting. " + JSON.stringify(data));
        }
    };

    var data = req.body;
    api.insertCollection(req.params.object, data, success);
});

module.exports = router;
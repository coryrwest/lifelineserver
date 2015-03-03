var express = require('express');
var router = express.Router();
var api = require('../data_access/api.js');
var moment = require('moment-timezone');
var categoriesList = require('../categories.json');
var request = require('request');
var sugar = require('sugar');

router.post('/transactions', function(req, res) {
    var success = function(data) {
        // Email success
        request.post({url: 'http://crw-smtpmailer.herokuapp.com/send', body: {
            "token":"f7hf873n4889dgf879dh33kjnei8",
            "to":"cmputrgk@gmail.com",
            "subject":"Bank data upload success",
            "message":"Bank data upload success"
        }, json: true}, function(err) { if (err) {
            return console.error('email failed:', err);
        } });

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

    // Process bank data
    if (data instanceof Array) {
        // Get existing items and filter out all duplicates
        // from the new data set
        data = data.sortBy('date');
        var formattedDate = data[0].date;
        api.getRange('bank_data', formattedDate, null, null, 'all', function(existing) {
            // assign id numbers
            data = assignTransactionIds(data);

            // filter transactions
            data = filterExistingItems(existing, data);

            // Now that we have only new items, map the categories
            data = mapCategories(data);

            // Finally do the insert
            api.insertCollection('bank_data', data, success);
        });
    } else {
        res.json(500, "The data supplied was not an array.");
    }
});

module.exports = router;

var filterExistingItems = function(existing, newTrans) {
    if (existing && existing != null) {
        var filteredTrans = [];

        // filter out existing records
        for(var i = 0; i < newTrans.length; i++) {
            if(!doesItemExist(newTrans[i].transactionId, existing.map('transactionId'))) {
                filteredTrans.push(newTrans[i]);
            }
        }
        // reassign new records
        newTrans = filteredTrans;
    }

    return newTrans;
};

var assignTransactionIds = function(transactions) {
    function getHash(string) {
        var hash = 0, i, chr, len;
        if (string.length == 0) return hash;
        for (i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    for(var i = 0; i < transactions.length; i++) {
        var key = transactions[i].date + transactions[i].description + transactions[i].amount + transactions[i].source;
        transactions[i].transactionId = getHash(key);
    }

    return transactions;
};

var mapCategories = function(transactions) {
    // Get the categories and their keywords
    var categories = categoriesList;

    for(var i = 0; i < transactions.length; i++) {
        for(var j = 0; j < categories.length; j++) {
            if (transactions[i].description && matchInArray(categories[j].keywords, transactions[i].description)) {
                transactions[i].category = categories[j].category;
            }
        }
    }

    return transactions;
};


var doesItemExist = function(id, collection) {
    for(var j = 0; j < collection.length; j++) {
        if(id === collection[j]) {
            return true;
        }
    }
    return false;
};

var matchInArray = function(array, match) {
    var matched = false;
    for(var i = 0; i < array.length; i++) {
        matched = match.toUpperCase().indexOf(array[i].toUpperCase()) != -1;
        if (matched) break;
    }
    return matched;
};
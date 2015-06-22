var db = require('../data_access/couchdb.js');
var moment = require('moment-timezone');

describe('insert_an_item', function() {
    it('should insert an item', function() {
        var finished = false,
            data;

        var testData = {'test': 'this is a test object 1'};

        runs(function() {
            db.insert('test', testData, function(result) {
                finished = true;
                data = result;
            });
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 4000);

        runs(function() {
            expect(data.ok).toBe(true);
        });
    });
});
var db = require('../data_access/couchdb.js');
var moment = require('moment-timezone');

describe('update_an_item', function() {
    it('should insert an item, get it back, and update it', function() {
        var finished = false,
            data;

        var testData = {'test': 'this is a test object 1'};
        var updateTest = 'this is updated data';

        runs(function() {
            db.insert('test', testData, function(result) {
                finished = true;
                var id = result._id;

            });
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 4000);

        runs(function() {
            // reset finished flag to get ready for update.
            finished = false;
            data.test = updateTest;
            db.update('test', data, function(result) {
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
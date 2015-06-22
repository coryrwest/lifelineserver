var db = require('../data_access/couchdb.js');
var moment = require('moment-timezone');

describe('insertCollection', function() {
    it('should insert 3 items', function() {
        var finished = false,
            data;

        var testData = [
            {'test': 'this is a test object 1'},
            {'test': 'this is a test object 2'},
            {'test': 'this is a test object 3'}
        ];

        runs(function() {
            db.insertCollection('test', testData, function(result) {
                finished = true;
                data = result;
            });
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 4000);

        runs(function() {
            expect(data.length).toBe(3);
        });
    });
});
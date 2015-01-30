var db = require('../data_access/db.js');
var moment = require('moment-timezone');

describe('water_post_empty', function() {
    it('should return object with date and time', function() {
        var finished = false,
            data;

        runs(function() {
            db.save.insert('water', {}, function(result) {
                finished = true;
                data = result;
            }, false);
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 1000);

        runs(function() {
            expect(data.date).toBe(moment().format('MM-DD-YYYY'));
            expect(data.time).toBe(moment().tz("America/Los_Angeles").format("HH:mma z"));
            expect(data.objectType).toBe('counter');

            db.remove.single('water', data.objectId, null);
        });
    });
});

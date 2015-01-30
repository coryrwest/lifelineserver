var db = require('../data_access/db.js');
var moment = require('moment-timezone');

describe('water_put', function() {
    var date = moment().add(2, 'days').format('MM-DD-YYYY');
    it('should return object with changed value', function() {
        var finished = false,
            finished2 = false,
            data;

        runs(function() {
            db.get.single('water', {where: {date: date}}, function(result) {
                finished = true;
                data = result;
            });
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 1000);

        runs(function() {
            // change value
            data.value = 10;

            db.save.update('water', data, function(result) {
                finished2 = true;
                data = result;
            }, false);
        });

        waitsFor(function() {
            return finished2;
        }, "DB should complete", 1000);

        runs(function() {
            expect(data).not.toBe(null);

            //db.remove.single('water', data.objectId, null);
        });
    });
});

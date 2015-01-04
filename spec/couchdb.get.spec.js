var db = require('../couchdb.js');
var moment = require('moment-timezone');
//var jasmine = require('jasmine-node');

describe('jasmine_working', function() {
    it('should return true', function() {
        expect(true).toBe(true);
    });
});

//describe('water_getSingle_createNew_null_params', function() {
//    it('should get todays data', function() {
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.single('water', null, function(result) {
//                finished = true;
//                data = result;
//            });
//        });
//
//        waitsFor(function() {
//            return finished;
//        }, "DB should complete", 1000);
//
//        runs(function() {
//            expect(data.date).toBe(moment().format('MM-DD-YYYY'));
//        });
//    });
//});
//
//describe('water_getSingle_createNew_undefined_params', function() {
//    it('should get todays data', function() {
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.single('water', undefined, function(result) {
//                finished = true;
//                data = result;
//            });
//        });
//
//        waitsFor(function() {
//            return finished;
//        }, "DB should complete", 1000);
//
//        runs(function() {
//            expect(data.date).toBe(moment().format('MM-DD-YYYY'));
//        });
//    });
//});
//
//describe('water_getSingle_createNew_date_params', function() {
//    var date = moment().subtract(2, 'days').format('MM-DD-YYYY');
//    it('should get data for ' + date, function() {
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.single('water', {where: {date: date}}, function(result) {
//                finished = true;
//                data = result;
//            });
//        });
//
//        waitsFor(function() {
//            return finished;
//        }, "DB should complete", 1000);
//
//        runs(function() {
//            expect(data.date).toBe(date);
//        });
//    });
//});
//
//describe('water_getSingle_createNew_future_date', function() {
//    it('should return future date object', function() {
//        var date = moment().add(2, 'days').format('MM-DD-YYYY');
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.single('water', { where: { date: date } }, function(result) {
//                finished = true;
//                data = result;
//            });
//        });
//
//        waitsFor(function() {
//            return finished;
//        }, "DB should complete", 1000);
//
//        runs(function() {
//            expect(data.isNew).toBe(true);
//            expect(data.date).toBe(date);
//        });
//
//        runs(function() {
//            db.remove.single('water', data.objectId, null);
//        });
//    });
//});
//
//describe('water_getList_range_params', function() {
//    var start = moment().subtract(6, 'days').format('MM-DD-YYYY');
//    var end = moment().subtract(2, 'days').format('MM-DD-YYYY');
//    it('should get data for ' + start + " - " + end, function() {
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.list('water', {
//                order: '-date',
//                limit: 300,
//                where: { date: { $gte:start, $lte:end } }}, function(result) {
//                finished = true;
//                data = result;
//            }, false);
//        });
//
//        waitsFor(function() {
//            return finished;
//        }, "DB should complete", 1000);
//
//        runs(function() {
//            expect(data.length).not.toBe(0);
//        });
//    });
//});

describe('water_getList_no_params', function() {
    it('should return all data for object', function() {
        var finished = false,
            data;

        runs(function() {
            db.get.list('water', null, function(results) {
                data = results;
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 1000);

        runs(function() {
            expect(data.length).not.toBe(0);
            expect(data[0].type).toBe('water');
        });
    });
});
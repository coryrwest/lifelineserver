var db = require('../db.js');
var moment = require('moment-timezone');
//var jasmine = require('jasmine-node');

describe('jasmine_working', function() {
    it('should return true', function() {
        expect(true).toBe(true);
    });
});

describe('water_getSingle_null_params', function() {
    it('should get todays data', function() {
        var finished = false,
            data;

        runs(function() {
            db.get.single('water', null, function(result) {
                finished = true;
                data = result;
            }, false);
        });

        waitsFor(function() {
            return finished;
        }, "DB should complete", 1000);

        runs(function() {
            expect(data.date).toBe(moment().format('MM-DD-YYYY'));
        });
    });
});

//describe('water_getSingle_empty', function() {
//    it('should get nothing back', function() {
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.single('water', { where: { data: moment().add(2, 'days') } }, function(result) {
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
//            expect(data).toBe(null);
//        });
//    });
//});
//
//describe('water_getSingle_new', function() {
//    it('should get a new object', function() {
//        var finished = false,
//            data;
//
//        runs(function() {
//            db.get.single('water', { where: { data: moment().add(2, 'days') } }, function(result) {
//                finished = true;
//                data = result;
//            }, true);
//        });
//
//        waitsFor(function() {
//            return finished;
//        }, "DB should complete", 1000);
//
//        runs(function() {
//            expect(data.isNew).toBe(true);
//        });
//    });
//});
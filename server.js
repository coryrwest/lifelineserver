var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes/index');
var dataPoint = require('./routes/dataPoint');
var bank = require('./routes/bank');
var sleep = require('./routes/sleep');

var app = module.exports = express();

// settings

// define a custom res.message() method
// which stores messages in the session
app.response.message = function(msg){
  // reference `req.session` via the `this.req` reference
  var sess = this.req.session;
  // simply add the msg to an array for later
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

// log
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'text/*' }));

// routes
app.use('/', routes);
app.use('/data', dataPoint);
app.use('/bank', bank);
app.use('/sleep', sleep);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/doc'));

// Jobs
var jobs = require('./jobs');
jobs.weather('0 0 * * * *');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        var status = err.status || 500;
        res.status(status);
        res.json(status, {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    res.json(status, {
        message: err.message,
        error: {},
        title: 'error'
    });
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});

module.exports = app;

/* istanbul ignore next */
if (!module.parent) {
    var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

	if (typeof ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            ipaddress = "127.0.0.1";
        };

    app.listen(port, ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
	});
    console.log('Express started on port ' + port);
}

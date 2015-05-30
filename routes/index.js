var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

router.get('/doc', function(req, res) {
    res.sendfile('./doc/index.html');
});

router.get('/graph', function(req, res) {
    res.sendfile('./public/graph.html');
});

module.exports = router;
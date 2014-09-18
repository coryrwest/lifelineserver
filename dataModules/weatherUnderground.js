var rest = require('restler');

var weatherUnderground = function(zip) {
    var url_root = 'http://api.wunderground.com/api/';
    var api_key = 'c460e181460b9060';

    var full_url = url_root + api_key + '/conditions/';

    full_url += 'q/' + zip + '.json';

    this.getData = function(onComplete) {
        rest.get(full_url).on('complete', function(result) {
            if (result instanceof Error) {
                console.log('Error:', result.message);
                //this.retry(5000); // try again after 5 sec
            } else {
                onComplete(result);
            }
        });
    }
}

module.exports = weatherUnderground;
var fs = require('fs'),
    http = require('http'),
    apikey = '',
    bridgeIP = '';

var configureAPI = function() {
    fs.readFile('api.key', 'utf8', function(err, data) {
        apikey = data.trim();
    });

    var options = {
        host: 'www.meethue.com',
        port: 80,
        path: '/api/nupnp',
        method: 'GET'
    };

    http.get(options, function(res) {
        res.on('data', function (chunk) {
            data = JSON.parse(chunk);
            bridgeIP = data[0].internalipaddress;
        });
    }).on('error', function(err) {
        console.log(err);
    });
};

exports.reconfigure = configureAPI;
exports.lights = function(callback) {

    var options = {
        host: bridgeIP,
        port: 80,
        path: '/api/' + apikey + '/lights',
        method: 'GET'
    };

    http.get(options, function(res) {
        res.on('data', function (chunk) {
             callback(JSON.parse(chunk));
        });
    }).on('error', function(err) {
        console.log(err);
    });

}

configureAPI();

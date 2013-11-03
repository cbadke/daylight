var fs = require('fs'),
    Promise = require('promise'),
    http = require('http'),
    apikey = '',
    bridgeIP = '';

var httpGET = function(hostname, path, success, failure) {
    var options = {
        host: hostname,
        port: 80,
        path: path,
        method: 'GET'
    };

    http.get(options, function(res) {
        res.on('data', function (chunk) {
            success(JSON.parse(chunk));
        });
    }).on('error', function(err) {
        failure(err);
    });
};

var hueGET = function(apiCall){
    return new Promise(function (resolve, reject) {
        httpGET(bridgeIP, '/api/' + apikey + '/' + apiCall, resolve, reject);
    });
};

exports.reconfigure = function() {
    fs.readFile('api.key', 'utf8', function(err, data) {
        apikey = data.trim();
    });

    httpGET('www.meethue.com', 
            '/api/nupnp', 
            function(data){ 
                bridgeIP = data[0].internalipaddress;
            });
};

exports.lights = function() {
    return hueGET('lights').then(function(lights){
        var getDetails = function(id) {
            return hueGET('lights/'+id);
        };
        var details = Object.keys(lights).map(getDetails);
        return Promise.all(details);
    });
}

exports.reconfigure();

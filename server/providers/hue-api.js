var fs = require('fs'),
    Promise = require('promise'),
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

var getLightDetails = function(id){
    return new Promise(function (resolve, reject) {
        var options = {
            host: bridgeIP,
           port: 80,
           path: '/api/' + apikey + '/lights/' + id,
           method: 'GET'
        };

        http.get(options, function(res) {
            res.on('data', function (chunk) {
                console.log(JSON.parse(chunk));
                resolve(JSON.parse(chunk));
            });
        }).on('error', function(err) {
            reject(err);
        });
    });
};

var getLights = function(){
    return new Promise(function (resolve, reject) {
        var options = {
            host: bridgeIP,
            port: 80,
            path: '/api/' + apikey + '/lights',
            method: 'GET'
        };

        http.get(options, function(res) {
            res.on('data', function (chunk) {
                console.log(JSON.parse(chunk));
                resolve(JSON.parse(chunk));
             });
        }).on('error', function(err) {
            reject(err);
        });
    });
};

exports.reconfigure = configureAPI;
exports.lights = function() {
    return getLights().then(function(lights){
        var details = Object.keys(lights).map(getLightDetails);
        return Promise.all(details);
    },
    console.log
    );
}

configureAPI();

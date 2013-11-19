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

var httpPUT = function(hostname, path, payload, success, failure) {

  payload = JSON.stringify(payload);

  var options = {
    host: hostname,
    port: 80,
    path: path,
    method: 'PUT',
    headers: {
      'Content-Type' : 'application/json',
      'Content-Length' : payload.length
    }
  };
  console.log(options);
  console.log(payload);

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      success(JSON.parse(chunk));
    });
  }).on('error', function(err) {
    failure(err);
  });

  req.write(payload);
  req.end();
};

var hueGET = function(apiCall){
    return new Promise(function (resolve, reject) {
        httpGET(bridgeIP, '/api/' + apikey + '/' + apiCall, resolve, reject);
    });
};

var huePUT = function(apiCall, payload){
  return new Promise(function (resolve, reject) {
    httpPUT(bridgeIP, '/api/' + apikey + '/' + apiCall, payload, resolve, reject);
  });
}

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
    return hueGET('lights')
           .then(function(lights){
             var getDetails = function(id) {
               return hueGET('lights/'+id)
                      .then(function(light){
                        light.id = id;
                        return light;
                      });
             };
             var details = Object.keys(lights).map(getDetails);
             return Promise.all(details);
           });
}

exports.toggleLight = function(id) {
  return hueGET('lights/'+id)
         .then( function(data) {
           return huePUT('lights/'+id+'/state',
             {
               on : !(data.state.on)
             });
         }).then( function(data) {
           console.log(data);
           return hueGET('lights/'+id);
         });
}

exports.reconfigure();

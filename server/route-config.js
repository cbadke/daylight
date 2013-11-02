var routes = require('./routes'),
    api = require('./providers/hue-api.js');

exports.configureRoutes = function(app){
	app.get('/', routes.index);

    app.get('/api/lights', function(req, res, next){
        api.lights(function(data) {
            res.json(data);
        });
    });
};


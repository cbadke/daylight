var routes = require('./routes'),
    api = require('./providers/hue-api.js');

exports.configureRoutes = function(app){
	app.get('/', routes.index);

    app.get('/api/lights', function(req, res, next){
        api.lights().done(function(data) {
            res.json(data);
        });
    });

    app.post('/api/lights/:id/toggle', function(req, res, next){
      var id = req.params.id;
      api.toggleLight(id).done(function(data) {
        res.json({ newState : data.state.on });
      });
    });
};


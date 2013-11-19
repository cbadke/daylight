'use strict';

angular.module('daylight').controller('HomeCtrl',
    function($scope, $resource){

        var Lights = $resource('/api/lights/:id', {},
                    { toggle: {
                                method : 'POST',
                                url : '/api/lights/:id/toggle'
                              }
                    });

        $scope.toggle = function(light) {
          Lights.toggle({id : light.id}, {}, function(data){
            light.state.on = data.newState;
          });
        };

        $scope.lights = Lights.query();
    }); 

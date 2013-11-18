'use strict';

angular.module('daylight').controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){

        var Lights = $resource('/api/lights');

        $scope.toggle = function(light) {
          light.state.on = !light.state.on;
        };

        $scope.lights = Lights.query();
    }]); 

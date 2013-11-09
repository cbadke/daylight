'use strict';

angular.module('daylight').controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){

        var Lights = $resource('/api/lights');

        $scope.lights = Lights.query();
    }]); 

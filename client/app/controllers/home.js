'use strict';

angular.module('hueNode').controller('HomeCtrl', ['$scope', '$resource',
    function($scope, $resource){

        var Lights = $resource('/api/lights');

        $scope.lights = Lights.query();
    }]); 

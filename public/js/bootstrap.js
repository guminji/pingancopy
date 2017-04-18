/**
 * Created by jason on 4/14/16.
 */


var angular = require('angular');

var apiConfig = require('../../api/api-config').config;

var app = angular.module('app', [
  require('@hdb/client'),
  'hdApi'
]);

app.value('apiConfig', apiConfig);

app.controller('Base', ['$scope', '$sce', function ($scope, $sce) {
  $scope.trustHtml = function(input) {
    return $sce.trustAsHtml(input);
  };
}]);

module.exports = app;
/**
 * Created by jason on 4/29/16.
 */

var app = require('../bootstrap');

app.controller('Home', ['$scope', 'utils', 'request', 'apiConfig', 'message',
  function ($scope, utils, request, apiConfig, message) {
    $scope.date = new Date;
    console.log(utils.getUrlParams());
    request.get(apiConfig.mallHome).then(function (res) {
      console.log(res);
      message.info('OK');
    }, function (res) {
      message.error('Error');
    });
  }]);
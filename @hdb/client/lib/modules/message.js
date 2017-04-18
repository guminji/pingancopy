/**
 * Created by jason on 12/25/15.
 */

var angular = require('angular');

var app = angular.module('hdMessages', []);

app.factory('message', ['$rootScope', '$timeout',
  function ($rootScope, $timeout) {
    var message = {};
    var type = {
      success: 'success',
      info: 'info',
      warning: 'warning',
      danger: 'danger'
    };
    var alert = function (msg, type, bottom, extraClass) {
      if(!msg) return;
      if ('string' === typeof msg) {
        msg = [msg];
      }
      $rootScope.pageAlert = true;
      $rootScope.alertType = type;
      $rootScope.bottom = bottom ? true : false;
      $rootScope.messages = msg;
      extraClass && ($rootScope.extraClass = extraClass);
      $timeout(function () {
        $rootScope.pageAlert = false;
      }, 3000);
    };
    message.success = function (msg, bottom, extraClass) {
      alert(msg, type.success, bottom, extraClass);
    };
    message.info = function (msg, bottom, extraClass) {
      alert(msg, type.info, bottom, extraClass);
    };
    message.warn = function (msg, bottom, extraClass) {
      alert(msg, type.warning, bottom, extraClass);
    };
    message.error = function (msg, bottom, extraClass) {
      alert(msg, type.danger, bottom, extraClass);
    };

    return message;
  }]
);

module.exports = 'hdMessages';

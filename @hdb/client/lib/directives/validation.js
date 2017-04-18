/**
 * Created by jason on 1/5/16.
 */

var angular = require('angular');

var app = angular.module('hdValidation', []);

var cellphoneRegex = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;

app.directive('cellphone', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, elem, attrs, ctrl) {
      ctrl.$parsers.unshift(function (value) {
        if (!value || cellphoneRegex.test(value)) {
          ctrl.$setValidity('cellphone', true);
        } else {
          ctrl.$setValidity('cellphone', false);
        }
        return value;
      });
    }
  };
});

module.exports = 'hdValidation';
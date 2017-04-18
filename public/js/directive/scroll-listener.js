/**
 * Created by yangzhilei on 16/5/17.
 */
var app = require('../bootstrap');
app.directive("scrollListener", function () {
  return {
    restrict: 'A',
    scope: {
      listener: '='
    },
    link: function (scope, element, attrs) {
      var ele = element[0];
      ele.addEventListener('scroll', onScroll, false);
      function onScroll(event) {
        var listener = scope.listener;
        if (typeof listener === 'function') {
          listener(ele);
        }
      }
    },
    controller: ["$scope", function (scope) {

    }],
  };
});

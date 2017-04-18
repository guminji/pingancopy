/**
 * Created by yangzhilei on 16/5/17.
 */
var app = require('../bootstrap');
app.directive("tabTitle", function () {
  var spanCls = "'common ' + ";
  spanCls += "($index == 0 ? 'left ' :' ')+($index == data.length-1 ? 'right ' :' ')";
  spanCls += "+(x.selected ?'selected':'')";
  return {
    restrict: 'AE',
    template: '<div class="tab_container">' +
    '<div class="tab_group">' +
    '<span ng-click="onTabChange(x)" ng-class="' + spanCls + '" ng-repeat="x in data">{{x.title}}</span>' +
    '</div>'
    + "</div>",
    scope: {
      data: "=",
      change: "="
    },
    replace: true,
    transclude: true,
    link: function (scope, element, attrs) {
      var data = scope.data;
      scope.onTabChange = function (obj) {
        var index = data.indexOf(obj);
        for (var i = 0; i < data.length; i++) {
          if (i != index) {
            data[i].selected = false;
          } else {
            if (data[i].selected != true) {
              performListener(i);
            }
            data[i].selected = true;
          }
        }
      }
      function performListener(index) {
        var change = scope.change;
        if (typeof change == 'function') {
          change(index);
        }
      }

      function notTrue(o) {
        return o.selected != true;
      }

      if (data.every(notTrue)) {
        data[0].selected = true;
        performListener(0);
      } else {
        for (var i in data) {
          if (data[i].selected == true) {
            performListener(i);
          }
        }
      }
    },
    controller: ["$scope", function (scope) {

    }],
  };
});

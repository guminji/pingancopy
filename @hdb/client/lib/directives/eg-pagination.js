/**
 * Created by jason on 12/14/15.
 */

var ui = require('./ui-directive');

ui.directive('egPagination', [function () {
  return {
    restrict: 'EA',
    scope: {
      page: '=',
      pageSize: '=',
      totalRecords: '='
    },
    templateUrl: '/resources/views/directives/eg-pagination',
    replace: true,
    controller: ['$scope', function($scope) {
      $scope.pageThreshold = 10;
      $scope.gotoPage = '';
      $scope.goto = function(page) {
        if(page < 1 || page > $scope.pageNumber) return;
        $scope.page = page;
      };
      $scope.prev = function() {
        if($scope.page - 1 < 0) return;
        $scope.page--;
      };
      $scope.next = function() {
        if($scope.page + 1 > $scope.pageNumber - 1) return;
        $scope.page++;
      };
      $scope.goManually = function(event) {
        if(event.which === 13) {
          $scope.goto($scope.gotoPage - 1);
        }
      };
    }],
    link: function($scope, element, attr) {
      $scope.pageNumber = Math.ceil($scope.totalRecords / $scope.pageSize);
      var pages = [];
      for(var p = 0; p < $scope.pageNumber; p++) {
        pages.push(p);
      }
      $scope.pages = pages;
    }
  };
}]);
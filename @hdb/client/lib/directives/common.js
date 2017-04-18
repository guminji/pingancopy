/**
 * Created by jason on 12/18/15.
 */

var ui = require('./ui-directive');

/**
 * @see https://github.com/incuna/angular-bind-html-compile
 */
ui.directive('bindHtmlCompile', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(function () {
        return scope.$eval(attrs.bindHtmlCompile);
      }, function (value) {
        // In case value is a TrustedValueHolderType, sometimes it
        // needs to be explicitly called into a string in order to
        // get the HTML string.
        element.html(value && value.toString());
        // If scope is provided use it, otherwise use parent scope
        var compileScope = scope;
        if (attrs.bindHtmlScope) {
          compileScope = scope.$eval(attrs.bindHtmlScope);
        }
        $compile(element.contents())(compileScope);
      });
    }
  };
}]);

ui.directive('lazyload', ['$timeout', function ($timeout){
  return {
    restrict: 'A',
    scope: {
      swipeText: '@',
      loadingText: '@',
      offsetBottom: '@',
      waitDuration: '@',
      allLoadedText: '@'
    },
    link: function($scope, element, attrs) {
      element.css('visibility', 'hidden');
      $scope.lazyLoading = false;
      var swipeText = $scope.swipeText || '上拉查看更多',
        loadingText = $scope.loadingText || '载入中...';
      element.html(swipeText);
      var offsetBottom = !isNaN(parseInt($scope.offsetBottom)) ? parseInt($scope.offsetBottom) : 10;
      var waitDuration = !isNaN(parseInt($scope.waitDuration)) ? parseInt($scope.waitDuration) : 500;
      var allLoaded = false;

      var listener1 = $scope.$on('lazyLoadingFinished', function () {
        $scope.lazyLoading = false;
        element.css('visibility', 'hidden');
        console.log('loading finished');
      });
      //alert('changes');
      var listener2 = $scope.$on('allLoaded', function () {
        allLoaded = true;
        $scope.lazyLoading = false;
        element.css('visibility', 'visible');
        window.removeEventListener('scroll', scrollHandler, false);
        element.html($scope.allLoadedText ? $scope.allLoadedText : '没有更多了!');
        listener1();
        listener2();
        console.log('all loaded');
      });

      var elementDom = element[0];
      var bottomed = true, firstTime = true;
      window.addEventListener('scroll', scrollHandler, false);
      function scrollHandler() {
        //console.log('scrolling');
        if($scope.lazyLoading || allLoaded) return;
        var position = elementDom.getBoundingClientRect();
        var screenHeight = screen.availHeight;
        //if(screenHeight - position.bottom < offsetBottom) {
        //  bottomed = true;
        //}
        //if(!bottomed && !firstTime) return;
        if(!bottomed && !firstTime) return;
        if(screenHeight - position.bottom >= offsetBottom) {
          firstTime = false;
          element.html(loadingText);
          $scope.lazyLoading = true;
          element.css('visibility', 'visible');
          $timeout(function() {
            //alert('loading now');
            $scope.$emit('lazyLoading');
            console.log('loading');
          }, waitDuration);
        }
      }
    }
  };
}]);


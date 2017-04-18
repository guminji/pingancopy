/**
 * Created by gsh on 16/5/19.
 */
var app = require('../bootstrap');
app.directive('lazyloadBefore', ['$timeout', function ($timeout){
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
            var iniPosition = '';
            element.css('visibility', 'hidden');
            $scope.lazyLoading = false;
            var swipeText = $scope.swipeText || '下拉查看更多',
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
                iniPosition = iniPosition || elementDom.getBoundingClientRect();
                var position = elementDom.getBoundingClientRect();
                var screenHeight = screen.availHeight;
                console.log('初始position为'+iniPosition.top+'现在的top为'+position.top);

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
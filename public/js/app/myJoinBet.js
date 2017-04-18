/**
 * Created by yangzhilei on 16/5/17.
 */
var app = require('../bootstrap');

app.controller('myJoinBet', ['$scope', 'utils', 'request', 'apiConfig', 'message', '$cookies', 'api',
  function ($scope, utils, request, apiConfig, message, $cookies, api) {
    $scope.rightArrow = window._appConfig.staticPrefix + '/public/img/right_arrow.png';
    $scope.pullDownMsg = '下拉加载更多';
    function createTitleGroup() {
      var title_group = [];
      title_group.push({title: '全部', type: -1});
      title_group.push({title: '待开奖', type: 0});
      title_group.push({title: '选中', type: 1});
      return title_group;
    }
    $scope.checkStatus = function(a){
      if(a=='0'){
        return '待开奖';
      }
      if(a=='2'){
        return '未中奖';
      }
      else{
        return '已退还'
      }
    }
    var titleGroup = createTitleGroup();
    $scope.changeListener = function (index) {
      $scope.current = index;
      reset(index);
      loadMore(index);
    }

    function loadMore(index) {
      $scope.nomoreINform =false;
      var obj = getObj(index);
      if (obj.loading === true) {
        return;
      }
      obj.loading = true;
      api.bets.getBetRecordList({status: titleGroup[index].type, page: obj.pageNo}).then(function (res) {
        if (obj.loading && obj.pageNo === res.page.pageNo) {
          var resDetail = res.page.result;
          console.log(resDetail.length==0);
          console.log(resDetail);
          if(resDetail.length==0){
            $scope.swipeText = '无数据';
            $scope.$broadcast('lazyLoadingFinished');
            $scope.nomoreINform =true;
          }
          obj.pageNo++;
          obj.data = obj.data.concat(api.bets.transData(res.page));
          obj.loading = false;
          $scope.$broadcast('lazyLoadingFinished');
        }
      },function(){
        $scope.$broadcast('lazyLoadingFinished');
      });
    }

    function reset(index) {
      $scope['list' + index] = {loading: false, data: [], pageNo: 1};
    }

    function getObj(index) {
      return $scope['list' + index];
    }

    function _init() {
      for (var i in titleGroup) {
        reset(i);
      }
    }

    _init();

    $scope.titleData = titleGroup;

    /*$scope.onScroll = function (element) {
      console.info(element.scrollHeight+'-'+element.scrollTop+"-"+element.offsetHeight);
      if (element.scrollHeight - element.scrollTop - element.offsetHeight < 100) {
        loadMore($scope.current);
      }
    }*/
    $scope.$on('lazyLoading', function () {
      loadMore($scope.current);
    });
  }]);
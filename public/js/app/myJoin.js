/**
 * Created by yangzhilei on 16/5/17.
 */
var app = require('../bootstrap');

app.controller('myJoin', ['$scope', 'utils', 'request', 'apiConfig', 'message', '$cookies', 'api',
  function ($scope, utils, request, apiConfig, message, $cookies, api) {
    $scope.rightArrow = window._appConfig.staticPrefix + '/public/img/right_arrow.png';
    function createTitleGroup() {
      var title_group = [];
      title_group.push({title: '单场', control: 'title_single', func: showSingle});
      // title_group.push({title: '多串一', control: 'title_more'});
      title_group.push({title: '大赢家', control: 'title_win', func: showWin});
      title_group.push({title: '单日互动券', control: 'title_coupon', func: showCoupon});
      return title_group;
    }

    var titleGroup = createTitleGroup();

    $scope.changeListener = function (index) {
      for (var i in titleGroup) {
        $scope[titleGroup[i].control] = false;
      }
      var func = titleGroup[index].func;
      if (typeof func == 'function') {
        func();
      }
    }

    $scope.toSingleDetail = function (obj) {
      location.href = 'my-join-detail?' + "id=" + obj.id;
    }

    //单场
    function showSingle() {
      api.bets.getBetRecordList().then(function (res) {
        $scope.title_single = true;
        $scope.single_list = api.bets.transData(res.page);
      });
    }

    //大赢家
    function showWin() {
      $scope.title_win = true;
    }

    //单日互动券
    function showCoupon() {
      $scope.title_coupon = true;
    }

    $scope.titleData = titleGroup;

  }]);
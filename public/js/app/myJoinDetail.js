/**
 * Created by yangzhilei on 16/5/18.
 */
var app = require('../bootstrap');

app.controller('myJoinDetail', ['$scope', 'api','utils', 'request', 'apiConfig', 'message', '$cookies',
  function ($scope, api, utils, request, apiConfig, message, $cookies) {
    var params = utils.getUrlParams();
    var id = params.id;
    function getImageUrl(type) {
      if(type == 1){
        return window._appConfig.staticPrefix + '/public/img/result_win.png';
      } else if(type == 2){
        return window._appConfig.staticPrefix + '/public/img/result_lose.png';
      } else {
        return window._appConfig.staticPrefix + '/public/img/result_unknown.png';
      }
    }

    function getTitle(type, score) {
      if(type == 1){
        return '获得奖金<span class="red">'+ score + '</span>特权本金';
      } else if(type == 2){
        return '请再接再厉吧';
      } else {
        return '请耐心等待';
      }
    }

    function updateTop(type, score){
      $scope.img_top  = getImageUrl(type);
      $scope.title_result = getTitle(type, score);
    }


    updateTop(1, 11);

    $scope.items = [
      {name:'广州恒大 vs 上海申花',country:'1 : 0'},
      {name:'互动玩法',country:'本场比赛90分钟内，xxxx'},
      {name:'我的选择',country:'主胜@1.34'},
      {name:'互动结果',country:'主胜'},
      {name:'参与时间',country:'2016-05-18 18:58:33'}];
    
    api.betsDetail.getBetDetail(1).then(function (res) {
      //TODO WYJ, wait server api
      $scope.items = res.result;
      console.log(res);
    })


  }]);
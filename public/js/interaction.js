/**
 * Created by gsh on 2016/5/13.
 */
var app = require('./bootstrap');

app.controller('Interaction',['$scope','api','$filter','native',function($scope,api,$filter,native){
  native.showLoading();
  $scope.isInteraction = 'click';
  $scope.pullDownMsg = '下拉加载更多';
  //search
  $scope.searchList = {};
  $scope.searchList.date=new Date().getTime();
  $scope.searchList.min_page_size = 10;
  $scope.searchList.direction=1;
  //list
  $scope.dataTable = [];
  /*$scope.href=function(a){
    window.location.href='single-interaction?matchID='+a
  };*/
  var origin = location.origin;
  $scope.href = function (a) {
    native.openLink(origin+'/football/single-interaction?matchID='+a,'赛事互动');
  };
  $scope.opendetail = function(){
    //window.location.href="my-join-bet"
    native.openLink(origin+'/football/my-join-bet','我的参与');
  }
  $scope.testLink = function(){
    native.openLink(origin+'/football/interaction','我的参与');
  }
  $scope.checkstatus=function(a,b){
    if(a=="未开始"){
      return b+' 开始';
    }
    else if(a=='进行中'){
      return '进行中';
    }
    if(a=="已结束"){
      return '已结束';
    }
    if(a=="延期"){
      return '延期';
    }
    if(a=="取消"){
      return '取消';
    }
    if(a=="弃赛"){
      return '弃赛';
    }
  }
  $scope.openStatus=function(a){
    if(a=="未开始"||a=="延期"||a=="取消"||a=="弃赛"){
      return true;
    }
    else{
      return false;
    }
  }
  var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  var getList = function(time){
    if(time)$scope.searchList.date = time;
    api.interaction.getList($scope.searchList).then(function(res){
      if(res.code==20000){
        var resDetail = res.result;
        /*if(resDetail.length<10){
          $scope.searchList.direction==1?$scope.$broadcast('allLoaded'):$scope.pullDownMsg='已加载完全部';
          return;
        }*/
        $scope.checkSameObj = function(a){
          for(var i=0;i<$scope.dataTable.length;i++){
            //console.log($scope.dataTable[i].day);
            //console.log(a.day);
            if($scope.dataTable[i].day == a.day){
              return false;
              //console.log('false');
            }
          }
          //console.log('true');
          //console.log(a);
          return true;
        }
        var match = {
          id:'',
          leagueName: '',
          matchPhase: '',
          status:'',
          giveuper:'',
          homeScore:'',
          guestScore:'',
          homeTeam:'',
          guestTeam:'',
          beginTime:'',
          win:'',
          draw:'',
          lose:'',
          weekDay:''
        };
        var statusNameObj = {
          0:'未开始',
          1:'进行中',
          2:'已结束',
          3:'延期',
          4:'取消',
          5:'弃赛',
        }
        var matches = [];
        var dataMatches = {};
        dataMatches.matches = [];
        angular.forEach(resDetail,function(data,i){
          var temp = angular.extend({}, match);
          temp.day = $filter('date')(new Date(data['beginTime']), 'MM-dd');
          temp.time =$filter('date')(new Date(data['beginTime']), 'HH:mm');
          temp.wday = $filter('date')(new Date(data['beginTime']), 'yyyy-M-d');
          //temp.week =$filter('date')(new Date(data['beginTime']), 'HH:mm');
          temp.wweek =new Date(temp.wday.split('-')[0],parseInt(temp.wday.split('-')[1]-1),temp.wday.split('-')[2]);
          temp.weekDay = weekArray[temp.wweek.getDay()];
          /*temp.statusName = statusNameObj[data['status']];*/
          temp.statusName = $scope.checkstatus(statusNameObj[data['status']],temp.time);
          temp.statusd =$scope.openStatus(statusNameObj[data['status']]);
          temp = intersectionMerge(temp,data);
          temp = intersectionMerge(temp,getOdds(data['fbEntityVoList']));
          //console.log('第'+i+'个match'+temp.id);
          matches.push(temp);
        });

        var arr = [];
        for(var i=0;i<matches.length;i++){
          var temp = {matches:[]};
          if(!arr[0]){
            arr.push(matches[i]);
          }
          if(matches[i+1]&&matches[i]['day']==matches[i+1]['day']){
            arr.push(matches[i+1]);
          }else if(matches[i+1]&&matches[i]['day']!=matches[i+1]['day']&&arr[0]){
            temp.day = arr[0].day;
            temp.matches = arr;
            if($scope.checkSameObj(temp)){
              setDataTable(temp);
            }
            arr = [];
          }else if(arr[0]){
            temp.day = arr[0].day;
            temp.matches=arr;
            if($scope.checkSameObj(temp)) {
              setDataTable(temp);
            }
            arr = [];
          }
        }
        native.hideLoading();
        if(resDetail.length<10){
          $scope.searchList.direction==1?$scope.$broadcast('allLoaded'):$scope.pullDownMsg='已加载完全部';
          return;
        }
      }else{
        //native.appToken(getList);
        alert('网络开小差了，请稍后重试～');
      }
      $scope.$broadcast('lazyLoadingFinished');
    },function(res){
      if(res.code=='40405'||res.code=='40002'||res.code=='40404'||res.code=='40403'){
        native.appToken(getList);
        return;
      }
      //alert(1);
      //native.appToken(getList);
      //alert('网络开小差了，请稍后重试～');
      $scope.$broadcast('lazyLoadingFinished');
    })
  };

  var setDataTable = function(obj){
    $scope.searchList.direction == 1?$scope.dataTable.push(obj):$scope.dataTable.unshift(obj);
  };


  //$scope.getList();

  var intersectionMerge = function(obj1,obj2){
    for(var i in obj1){
      for(var j in obj2){
        if(i==j){
          obj1[i] = obj2[j];
        }
      }
    }
    return obj1;
  };
  //getList();
  /*var arrs = [getList];
  //$scope.getList();
  native.getLoginStatus(arrs);*/
  //得到赔率方法
  var getOdds = function(fbEntityVoList){
    for(var i in fbEntityVoList){
      var temp = {};
      if(/^3W/.test(fbEntityVoList[i]['name'])){
        switch(fbEntityVoList[i]['betOddVoList'][0]['title']){
          case '主胜':temp.win=fbEntityVoList[i]['betOddVoList'][0]['rate'];break;
          case '平':temp.draw=fbEntityVoList[i]['betOddVoList'][0]['rate'];break;
          case 'title':temp.lose=fbEntityVoList[i]['betOddVoList'][0]['rate'];
        }
      }
    }
    return temp;
  };

  $scope.$on('lazyLoading', function () {
    var temp = new Date($scope.dataTable[$scope.dataTable.length-1]['matches'][0]['beginTime']);
    //console.log('现在拿到的日期是'+temp.toLocaleString());
    $scope.searchList.direction = 1;
    temp.setDate(temp.getDate() + 1);
    //console.log('加了一天的时间是'+temp.toLocaleString());
    getList(temp.getTime());
  });

  //getList();

  //var arrs = [getList];
  getList();
  //native.getLoginStatus(arrs);

  /*var n = 0;

  function backShow() {
    setTimeout(function () {
      if (window.backViewStatus == 'goHome') {
        n = 0;
        native.gotoAppHome();
        window.backViewStatus = 'goLogin';
      } else if (window.backViewStatus == 'goLogin'){
        n = 0;
        native.getLoginStatus(arrs);
      } else {
        n++;
        if (n > 40) {
          n = 0;
          native.getLoginStatus(arrs);
          return false;
        }
        backShow()
      }
    }, 50);
  }
  native.onWebViewShow();
  window.hybirdCallback.onWebViewShow = function (){
    backShow();
  };*/
}]);

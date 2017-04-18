/**
 * Created by gsh on 2016/5/11.
 */
var app = require('../bootstrap');
app.directive('betMatchBox',function(){
  return{
    restrict:'AE',
    template:'<div class="match-box" ng-repeat="(i,j) in dataTable">' +
    '<div class="date">' +
    '<span>{{j["day"]}}</span></div>' +
    '<div class="bet-match" ng-repeat="x in j.match">' +
    '<b>主队:</b>{{x["team1"]}}' +
    '<b>客队:</b>{{x["team2"]}}' +
    '<b ng-click="addDUixiang(x.id)">主胜:</b>{{x["win"]}}' +
    '<b>平:</b>{{x["draw"]}}' +
    '<b>客胜:</b>{{x["lose"]}}' +
    '</div>'+
    '</div>',
    replace:true,
    transclude:true,
    controller:function(){

    }
  }
});
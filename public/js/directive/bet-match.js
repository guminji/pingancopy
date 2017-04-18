/**
 * Created by gsh on 2016/5/12.
 */
var app = require('../bootstrap');
app.directive('betMatch',function(){
  return{
    restrict:'AE',
    template:'<div class="bet-match" ng-repeat="x in j.match">' +
    '主队:{{x["team1"]}}' +
    '客队:{{x["team2"]}}' +
    '主胜:{{x["win"]}}' +
    '平:{{x["draw"]}}' +
    '客胜:{{x["lose"]}}' +
    '</div>',

    replace:true,
    transclude:true,
    controller:function(){

    }
  }
});
/**
 * Created by gsh on 2016/5/12.
 */
var app = require('../bootstrap');
app.directive('betMatch',function(){
  return{
    restrict:'AE',
    template:'<div class="bet-match" ng-repeat="x in j.match">' +
    '����:{{x["team1"]}}' +
    '�Ͷ�:{{x["team2"]}}' +
    '��ʤ:{{x["win"]}}' +
    'ƽ:{{x["draw"]}}' +
    '��ʤ:{{x["lose"]}}' +
    '</div>',

    replace:true,
    transclude:true,
    controller:function(){

    }
  }
});
/**
 * Created by jason on 12/21/15.
 */

var angular = require('angular');

var apiModule = angular.module('hdApi', [
  require('@hdb/client/lib/modules/http'),
  require('@hdb/client/lib/modules/session')
]);

apiModule.factory('api', [
  'request', 'apiConfig', 'session', '$cookies',
  function (request, apiConfig, session, $cookies) {

    var option = {};
    option.headers = {};
    /*option.headers = {
      'X-Hdfax-AuthToken':'3010a897-883b-4946-b7cc-42a4e6e9815d',
      'X-Hdfax-ClientId':'dc91ffdd-84f8-4cf2-89b6-fd8add7a2d14787f46b1-41bd-4292-830d-8d126ce2e0ec'
    };*/
    if ($cookies.get('token')) {
      option.headers = {
        'X-Hdfax-AuthToken': $cookies.get('token'),
        'X-Hdfax-ClientId': $cookies.get('clientId')
        //'X-Hdfax-UserId': 'XXSFSDFFSS2233'
      }
    }
    return {
      updateToken:function(token){
        //alert('token:'+token);
        angular.extend(option.headers,{'X-Hdfax-AuthToken':token});
      },
      updateClientId:function (clientId){
        //alert('token:'+token);
        angular.extend(option.headers,{'X-Hdfax-ClientId':clientId});
      },
      getToken:function(){
        return option;
      },
      getMacthdetail: new (require('./getMatchdetail'))(request, apiConfig,option),
      test: new (require('./test-api'))(request, apiConfig),
      interaction: new (require('./interaction'))(request, apiConfig,option),
      uc: new (require('./uc'))(request, apiConfig, option),
      bets: new (require('./my-join'))(request, apiConfig, option),
      betsDetail: new (require('./my-join-detail'))(request, apiConfig,option),
      tokenExpired: function (code) {
        return code == 40404;
      }
    };
  }
]);

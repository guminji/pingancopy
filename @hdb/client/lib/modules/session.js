/**
 * Created by jason on 11/24/15.
 */

var angular = require('angular');

var session = angular.module('hdSession', [
  require('angular-cookies'),
  require('./message')
]);


session.factory('session', ['$cookies', 'message', function ($cookies, message) {
  var sessionInfo = {
    accessToken: "",
    expireTime: "",
    userId: ""
  };
  var session = {};
  session.getAccessToken = function() {
    var cookie = $cookies.get('token');
    return cookie ? cookie : sessionInfo.accessToken;
  };
  session.getUserId = function() {
    return sessionInfo.userId;
  };
  session.getCellphone = function() {
    return sessionInfo.cellphone;
  };
  session.setTokenInfo = function(info) {
    angular.extend(sessionInfo, info);
    $cookies.put('token', sessionInfo.accessToken, {path: '/', expires: new Date(sessionInfo.expireTime)});
    $cookies.put('uid', sessionInfo.userId, {path: '/', expires: new Date(sessionInfo.expireTime)});
    localStorage.setItem('session', JSON.stringify(sessionInfo));
  };

  session.removeSession = function() {
    $cookies.remove('token', {path: '/', expires: new Date(sessionInfo.expireTime)});
    localStorage.removeItem('session');
  };

  session.getSessionLocally = function() {
    var tokenFromCookie = $cookies.get('token');
    if(!tokenFromCookie || !localStorage.session) return null;
    var localSession = JSON.parse(localStorage.session);
    if(!localSession || tokenFromCookie != localSession.accessToken) {
      localStorage.removeItem('session');
      return null;
    }
    angular.extend(sessionInfo, localSession);
    return sessionInfo;
  };

  //simple login check in browser
  session.isLoggedIn = function() {
    return !!session.getAccessToken();
  };

  session.loginRedirect = function(noRedirect) {
    if(noRedirect) {
      if(!session.isLoggedIn()) {
        message.warn('您还没有登录! ' +
          '<a class="btn btn-primary-eg btn-login" href="/bq/login?from='
          + encodeURIComponent(location.href) + '">立即登录</a>', true, 'text-right');
        return true;
      }
      return false;
    }
    if(!session.isLoggedIn()) {
      session.redirectNow();
      return true;
    }
    return false;
  };
  session.loginRedirectFromAPI = function() {
    if(session.isInApp()) {
      session.redirectForApp(true);
    } else {
      session.redirectNow();
    }
  };
  session.redirectNow = function(customUrl) {
    location.href = (customUrl ? customUrl : '/bq/login') + '?from=' + encodeURIComponent(location.href);
  };
  session.redirectForApp = function(force) {
    if(!force && session.isLoggedIn()) {
      return false;
    }
    location.href = 'hengdabi://userLogin';
    return true;
  };
  session.getSessionForApp = function() {
    return {
      cellphone: $cookies.get('cellphone')
    };
  };
  session.setAppEntry = function(entry) {
    sessionStorage.setItem('entry', entry);
  };
  session.isInApp = function() {
    return !!sessionStorage.getItem('entry');
  };
  return session;
}]);

module.exports = 'hdSession';
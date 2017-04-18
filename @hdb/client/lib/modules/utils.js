/**
 * Created by jason on 11/23/15.
 */

var angular = require('angular');

var hdUtils = angular.module('hdUtils', []);

hdUtils.factory("utils", [function() {
  var partnerMap = {
    1: 'uber',
    2: 'dianping',
    3: 'gewara'
  };
  var weekDayMap = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    0: '星期日'
  };
  var ua = navigator.userAgent.toLowerCase();
  return {
    getUrlParams: function() {
      var params = {};
      var url = location.search;
      var lastQuestionMarkLoc = url.lastIndexOf('?');//返回一个数字
      if (lastQuestionMarkLoc >= 0) {
        var paramsArr = url.slice(lastQuestionMarkLoc + 1).split('&');
        for (var i in paramsArr) {
          var item = paramsArr[i];
          var paramKeyVal = item.split('=');
          params[paramKeyVal[0]] = paramKeyVal[1];
        }
      }
      return params;
    },
    isEmpty: function(input) {
      if(!input) return true;
      if(Array.isArray(input) && input.length === 0) return true;
      if('object' === typeof input && Object.keys.length === 0) return true;
      return false;
    },
    addQueryParams: function(url, params) {
      if(!url) throw new Error('You must pass the url!');
      if(!params) return url;
      var temp = url + '?';
      var parts = [];
      angular.forEach(params, function(value, key) {
        parts.push(key + '=' + value);
      });
      return temp + parts.join('&');
    },
    getPartnerName: function(orgId) {
      var temp = partnerMap[orgId];
      return temp || partnerMap[2];
    },
    isInWechat: function() {
      return ua.indexOf('micromessenger') >= 0;
    },
    isInAliApp: function() {
      return ua.indexOf('aliapp') >= 0;
    },
    isScannable: function() {
      return this.isInWechat();// || this.isInAliApp();
    },
    notifyPointsChangeForApp: function() {
      location.href = 'hengdabi://userPointChange';
    },
    //simple check
    isIOS: function() {
      return ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0;
    },
    isAndroid: function() {
      return ua.indexOf('android') >= 0;
    },
    loadScriptAsync: function(src, cb) {
      var ele = document.createElement('script');
      ele.src = location.protocol + src;
      ele.async = true;
      var linkEle = document.getElementsByTagName('script')[0];
      linkEle.parentNode.insertBefore(ele, linkEle);
      ele.onload = function() {
        cb && cb();
      };
    },
    isLocalMode: function() {
      return !!window._appConfig.isLocalMode;
    },
    isDevMode: function() {
      return !!window._appConfig.isDevMode;
    },
    isUATMode: function() {
      return !!window._appConfig.isUATMode;
    },
    isProdMode: function() {
      return !!window._appConfig.isProdMode;
    },
    loadEncodeScript: function() {
      if(this.isUATMode() || this.isProdMode()) {
        this.loadScriptAsync('//s1.xiwanglife.com/bgjs/encode.js');
      }
    },
    getWeekDay: function(day) {
      return weekDayMap[day];
    }
  }
}]);

module.exports = 'hdUtils';
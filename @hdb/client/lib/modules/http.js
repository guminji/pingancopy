/**
 * Created by jason on 11/23/15.
 */

var angular = require('angular');

var http = angular.module('hdHttp', [require('./session'), require('./message')]);

var appConfig = window._appConfig ? window._appConfig : {};

http.factory("request", ['$http', '$q', 'session', 'message', function ($http, $q, session, message) {
  var request = {
    $http: $http
  };
  /**
   *
   * @param {string|object} url, if it's the object, it should contains a 'params' property,
   *   which is an Array contains all the parameters in order for the rest api url,
   *   e.g: users/mobile/:cellphone/token/:token --> {params: [cellphone, token]},
   *   other properties are configured in
   *   @see api-config.js
   * @param options
   * @returns {*}
   */
  request.send = function(url, options) {
    var temp = url;
    //with proxy, just request to node
    if(!(options.hasOwnProperty('proxy') && options.proxy === false)) {
      if('object' === typeof temp) {
        url = temp.namespace + formatRestfulUrl(temp.path, temp.params);
      }
      if((options && options.proxy) || appConfig.proxyEnabled) {
        url = appConfig.proxyPath + url;
      }
      if(!appConfig.proxyEnabled && appConfig.apiEndpoint && (appConfig.corsEnabled || appConfig.isProdMode)) {
        url = appConfig.apiEndpoint + (appConfig.corsEnabled ? appConfig.proxyPath : '')  + url;
      }
    }
    var defaultConfig = {
      url: url,
      timeout: 20000, //20s
      //withCredentials: true,
      headers: {}
    };
    if(session.getAccessToken()) {
      defaultConfig.headers['X-Auth-Token'] = session.getAccessToken();
    }
    //if(session.getUserId()) {
    //  defaultConfig.headers['X-User-Id'] = session.getUserId();
    //}
    if(options && options.headers) {
      angular.extend(defaultConfig.headers, options.headers);
      delete options.headers;
    }
    return $http(angular.extend(defaultConfig, options))
      .then(function (response) {
        if(response.data.code < 20000 || response.data.code > 29999) {
          return $q.reject(response.data);
        }
        return $q.resolve(response.data);
      }, function (response) {
        if(response.status < 0 || response.status == 408 ) {
          //location.reload();
          message.error('网络不给力,请稍后再试!');
          return $q.reject({code: -1});
        }
        return $q.reject(response.data);
      });
  };
  /**
   *
   * @param {string|Object} url
   * @param {Object=} params api params in url
   * @param {Object=} options custom $http configuration
   */
  request.get = function(url, params, options) {
    return request.send(url, angular.extend(options ? options : {}, {
      method: "GET",
      params: params
    }));
  };
  /**
   *
   * @param {string|Object} url, string or Object which contains the api configuration
   * @param {Object=} data data for port request
   * @param {Object=} options
   */
  request.post = function(url, data, options) {
    return request.send(url, angular.extend(options ? options : {}, {
      method: "POST",
      data: data
    }));
  };
  request.delete = function(url, data, options) {
    return request.send(url, angular.extend(options ? options : {}, {
      method: "delete",
      data: data
    }));
  };
  request.put = function(url, data, options) {
    return request.send(url, angular.extend(options ? options : {}, {
      method: "PUT",
      data: data
    }));
  };
  request.jsonp = function(url, params, options) {
    return request.send(url, angular.extend(options ? options : {}, {
      method: "JSONP",
      params: angular.extend(params ? params : {}, {callback: 'JSON_CALLBACK'})
    }));
  };

  function formatRestfulUrl (url, params) {
    if(!params) return url;
    var parts = url.split('/');
    var partIndex = 0;
    var isArray = Array.isArray(params);
    parts.forEach(function (ele, index) {
      if(ele.indexOf(':') == 0) {
        parts[index] = isArray ? params[partIndex] : params[ele.substring(1)];
        partIndex++;
      }
    });
    return parts.join('/');
  }
  return request;
}]);

module.exports = 'hdHttp';

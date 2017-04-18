/**
 * Created by jason on 12/14/15.
 */

var config = require('@hdb/config');
var staticEndpoints = config.getStaticAssetsEndpoint();
var staticHosts = [];
if(staticEndpoints) {
  if ('string' === typeof staticEndpoints) {
    if (staticEndpoints.indexOf('http') != 0) {
      staticEndpoints = 'http://' + staticEndpoints;
    }
    staticHosts.push(staticEndpoints);
  } else if (Array.isArray(staticEndpoints)) {
    staticEndpoints.forEach(function (endpoint) {
      if (endpoint.indexOf('http') != 0) {
        endpoint = 'http://' + endpoint;
      }
      staticHosts.push(endpoint);
    });
  }
}

//var staticHostsLength = staticHosts.length;
//var currentHost = 0;
if(!staticHosts[0]) {
  staticHosts[0] = '';
}
var staticHostsMap = {
  js: staticHosts[0],
  css: staticHosts[1] ? staticHosts[1] : staticHosts[0],
  others: staticHosts[2] ? staticHosts[2] : staticHosts[0]
};

exports.getStaticEndpoint = function (key) {
  if(!key || !staticHostsMap[key]) return staticHostsMap.js;
  return staticHostsMap[key];
};

//check boolean if it's a string
exports.checkBoolean = function(b) {
  if ('boolean' === typeof b) {
    return b;
  }
  return b === 'true';
};

exports.paramsToString = function(args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

exports.isIphone = function(req) {
  var ua = req.get('User-Agent').toLowerCase();
  return ua.indexOf('iphone') >= 0;
};
exports.isAndroid = function(req) {
  var ua = req.get('User-Agent').toLowerCase();
  return ua.indexOf('android') >= 0;
};
exports.isIOS = function(req) {
  var ua = req.get('User-Agent').toLowerCase();
  return ua.indexOf('iphone') >= 0 || ua.indexOf('ipad') >= 0;
};
exports.isInWechat = function(req) {
  var ua = req.get('User-Agent').toLowerCase();
  return ua.indexOf('micromessenger') >= 0;
};

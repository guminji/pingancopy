/**
 * Created by jason on 12/7/15.
 */

'use strict';

const request = require('request')
    , _ = require('lodash')
    , BB = require('bluebird')
    , logger = require('debug')('core')
    , appConfig = require('@hdb/config')
    ;

const debug = process.env.DEBUG;

if(appConfig.isLocalMode() && 'core' === debug) {
  request.debug = true;
  // require('request-debug')(request);
}

const proxyPath = appConfig.getProxyAddress();

function getProxyOptions(req, options) {
  var defaultOptions = {
    url: req.url,
    baseUrl: proxyPath,
    method: req.method,
    json: true,
    gzip: true
  };
  if(!_.isEmpty(options)) {
    defaultOptions = _.extend({}, options, defaultOptions);
  }
  return defaultOptions;
}

exports.proxyRequest = (req, res, noBB, options) => {
  return new BB(function (resolve, reject) {
    var apiRequest = req.pipe(request(getProxyOptions(req, options), (err, response, body) => {
      if(err) {
        logger(err);
      }
      if(!noBB) {
        if(err || response.statusCode != 200) {
          reject({statusCode: 500});
          logger(body);
        } else {
          resolve(body);
        }
      }
    }));
    if(noBB) {
      apiRequest.pipe(res);
      resolve();
    }
  });
};


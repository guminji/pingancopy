/**
 * Created by jason on 4/12/16.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const CONFIG_PATH = path.resolve(process.cwd(), 'config.json');
const REVISION_PATH = path.resolve(process.cwd(), 'public/build/rev-manifest.json');

var configInfo = {};
var revisionConfig = {};
try {
  fs.statSync(CONFIG_PATH);
} catch (e) {
  fs.writeFileSync(CONFIG_PATH, fs.readFileSync(path.resolve(__dirname, 'config.json.sample')));
  console.log('creating config file finished');
} finally {
  configInfo = JSON.parse(fs.readFileSync(CONFIG_PATH));
}

try {
  fs.statSync(REVISION_PATH);
  revisionConfig = JSON.parse(fs.readFileSync(REVISION_PATH));
} catch(e) {

}

module.exports = {
  revisionConfig: revisionConfig,
  getListeningPort: () => getConfigProperty('NODE_PORT'),
  getAdminListeningPort: () => getConfigProperty('ADMIN_NODE_PORT'),
  getNodeEnv: () => getConfigProperty('NODE_ENV'),
  getApiEndpoint: () => getConfigProperty('API_ENDPOINT'),
  isDevMode: () => {
    const env = getConfigProperty('NODE_ENV');
    return 'dev' === env || 'development' === env;
  },
  isLocalMode: () => {
    const env = getConfigProperty('NODE_ENV');
    return 'local' === env || 'localhost' === env;
  },
  isProdMode: () => {
    const env = getConfigProperty('NODE_ENV');
    return 'prod' === env || 'production' === env;
  },
  isUATMode: () => {
    const env = getConfigProperty('NODE_ENV');
    return 'uat' === env;
  },
  isStagingMode: () => {
    const env = getConfigProperty('NODE_ENV');
    return 'stage' === env || 'staging' === env;
  },
  isNodeProxyEnabled: () => !!getConfigProperty('NODE_PROXY'),
  getProxyPath: () => getConfigProperty('PROXY_PATH') || '',
  getStaticAssetsEndpoint: () => getConfigProperty('STATIC_ENDPOINT'),
  getEnv: key => getConfigProperty(key),
  getWeChatConfig: () => getConfigProperty('wechat') || {},
  isCORSEnabled: () => !!getConfigProperty('API_CORS'),
  getProxyAddress: function () {
    var apiEndpoint = this.getApiEndpoint();
    if(apiEndpoint.indexOf('http') < 0) {
      apiEndpoint = ['http://', apiEndpoint].join('');
    }
    return apiEndpoint;
  },
  getStaticPrefix: () => {
    var sp = getConfigProperty('STATIC_PREFIX');
    if(!sp) {
      sp = '';
    }
    return sp;
  }
};

function getConfigProperty(key) {
  const valueFormEnv = process.env[key];
  if(valueFormEnv) {
    return valueFormEnv;
  }
  return configInfo[key];
}
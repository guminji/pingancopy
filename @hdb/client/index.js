/**
 * Created by jason on 4/15/16.
 */

var angular = require('angular');

require('./lib/directives/ui-directive');
require('./lib/directives/common');
require('./lib/directives/eg-pagination');
require('./lib/directives/eg-table');

var hdAngular = angular.module('hdAngular', [
  'UIDirective',
  require('./lib/directives/validation'),
  require('./lib/modules/http'),
  require('./lib/modules/message'),
  require('./lib/modules/session'),
  require('./lib/modules/utils'),
  require('./lib/modules/wechat')
]);

module.exports = 'hdAngular';
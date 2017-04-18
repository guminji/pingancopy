/**
 * Created by jason on 5/11/16.
 */

function getMacthAPI(request, api,option) {
  this.request = request;
  this.api = api;
  this.option = option;
}

getMacthAPI.prototype.getmatchdetail = function(id) {
  return this.request.get(angular.extend({
    params: [id]
  }, this.api.getmacthdetail),{},angular.extend({},this.option));
};

module.exports = getMacthAPI;
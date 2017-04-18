/**
 * Created by gsh on 5/17/16.
 */

function Interaction(request, api,option) {
  this.request = request;
  this.api = api;
  this.option =option;
}

Interaction.prototype.test = function(SearchList) {
  return this.request.get(angular.extend({
    params: [orgId,phoneNum]
  }, this.api.checkNewUser));
};

Interaction.prototype.getList = function(searchList) {
  return this.request.get(this.api.betfootballList,searchList,angular.extend({}, this.option));
};

module.exports = Interaction;
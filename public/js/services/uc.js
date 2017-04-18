/**
 * Created by fengqingyong on 2016/5/10.
 */

function Uc(request, api,option) {
  this.request = request;
  this.api = api;
  this.option = option;
}

Uc.prototype.getDiscoveryBanner = function() {
  return this.request.get(this.api.getDiscoveryBanner);
};

Uc.prototype.getPoints = function(){
  return this.request.get(this.api.getPoints,{},angular.extend({},this.option));
};
Uc.prototype.getPointsHistory = function(params){
  return this.request.get(this.api.getPointsHistory,params,angular.extend({},this.option))
};
Uc.prototype.getLastReward = function(){
  return this.request.get(this.api.getLastReward,{},angular.extend({},this.option));
};
Uc.prototype.getRewardHistory = function(params){
  return this.request.get(this.api.getRewardHistory,params,angular.extend({},this.option))
};
Uc.prototype.getTotalReward = function(){
  return this.request.get(this.api.getTotalReward,{},angular.extend({},this.option))
};
Uc.prototype.betting= function(parmas){
  return this.request.post(this.api.betting,parmas,angular.extend({},this.option))
};
Uc.prototype.getUcash =function(){
  return this.request.get(this.api.getPoints, {}, angular.extend({},this.option))
}



module.exports = Uc;
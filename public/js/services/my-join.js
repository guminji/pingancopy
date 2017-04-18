/**
 * Created by yangzhilei on 16/5/19.
 */
function MyJoin(request, api, option) {
  this.request = request;
  this.api = api;
  this.option = option;
}

MyJoin.prototype.getBetRecordList = function (params) {
  return this.request.get(this.api.getBetRecords, {
    page_size: params && params.pageSize || 10,
    page: params && params.page || 1,
    status: params && params.status || 0
  }, angular.extend({}, this.option));
};
function ItemModel(text, value) {
  this.text = text;
  this.value = value;
}

/**
 * "result": [
 {
   "homeTeam": "恒大",
   "guestTeam": "上港",
   "entityTitle": "90分钟内两队的比分",
   "status": 0,
   "mybet": "3:1",
   "result": null,
   "times": 5,
    "betTime": 1463661792000
   }]0： 未开奖 , 1：已中奖, 2:未中奖'  -1：全部
 */
MyJoin.prototype.transData = function (data) {
  var array = [];
  var result = data.result;
  if (result) {
    result.forEach(function (obj) {
      var arr = [];
      arr.push(new ItemModel('竞猜内容', obj.entityTitle));
      arr.push(new ItemModel('我的选择', obj.mybet));
      arr.push(new ItemModel('正确结果', obj.result || '--'));
      arr.push(new ItemModel('投入数量', obj.times));
      arr.push(new ItemModel('参与时间', require('dateformat')(new Date(obj.betTime), 'yyyy-mm-dd HH:MM:ss')))
      array.push({
        title: obj.homeTeam + ' vs ' + obj.guestTeam,
        status: obj.status,
        array: arr,//详细内容
        winCash: obj.winCash
      });
    });
  }
  return array;
}

module.exports = MyJoin;
/**
 * Created by ken on 16/5/19.
 */
function MyJoinDetail(request, api) {
  this.request = request;
  this.api = api;
}

MyJoinDetail.prototype.getBetDetail = function (params) {
  return this.request.get(this.api.getBetDetail, {
    id: params || ''
  })
}

module.exports = MyJoinDetail;
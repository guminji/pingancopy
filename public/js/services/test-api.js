/**
 * Created by jason on 5/11/16.
 */

function TestAPI(request, api) {
  this.request = request;
  this.api = api;
}

TestAPI.prototype.test = function() {
  return this.request.get(this.api.guessList, {}, {});
};

module.exports = TestAPI;
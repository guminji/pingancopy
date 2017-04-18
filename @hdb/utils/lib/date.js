/**
 * Created by jason on 11/25/15.
 */

var dateFormat = require('dateformat');

module.exports = {
  simpleDate: function() {
    return dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
  }
};
var _ = require('lodash')
  , url = require('url')
  , crypto = require("crypto")
  ;

var util = {};

util.genHash = function(text, algorithm) {
  var c = crypto.createHash(algorithm ? algorithm : "sha1");
  c.update(text);
  return c.digest("hex");
};
util.genNodeSessionId = function() {
  return util.getRandomSHA1();
};
util.getRandomSHA1 = function(byteLength) {
  return crypto.randomBytes(byteLength ? byteLength : 20).toString('hex');
};


util.genMD5 = function(text) {
  return util.genHash(text, "md5");
};

util.genSHA1 = function(text) {
  return util.genHash(text, "sha1");
};

util.strongPasswordValidation = function(password) {
  /**
   * - must contains lowercase letter
   * - must contains uppercase letter
   * - at least 2 numbers and 2 special characters
   * - at least 12 characters, 40 at most
   * @type {RegExp}
   */
  var re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])" +
    "(?=.*[0-9].*[0-9].*)" +
    "(?=.*[!@#\$%\^&\*\,\.;:_-].*[!@#\$%\^&\*\,\.;:_-].*)" +
    "(?=.{12,40})");
  return re.test(password);
};


module.exports = util;
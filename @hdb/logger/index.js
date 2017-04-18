/**
 * Created by jason on 4/11/16.
 */

const fs = require('fs');
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const expressWinston = require('express-winston');
const path = require('path');

var httpLogger = require('morgan');

var config = require('@hdb/config');
var dateUtil = require('@hdb/utils').date;
var logPath = './logs';

try {
  fs.statSync(logPath);
} catch (e) {
  fs.mkdirSync(logPath);
}

//simple http logger
httpLogger.token('simpleDate', function (req, res) {
  return dateUtil.simpleDate();
});
httpLogger.token('userAgent', function (req, res) {
  return req.get('User-Agent');
});

httpLogger.token('ip', function (req, res) {
  return req.ip;
});
var httpLoggerFormat = '[:simpleDate] [:ip] :method :url :status [:response-time ms]';
exports.httpLogger = httpLogger(httpLoggerFormat);

exports.defaultLogger = new (winston.Logger)({
  transports: getLoggerTransports('default-logger', 'app')
});
exports.defaultAdminLogger = new (winston.Logger)({
  transports: getLoggerTransports('default-admin-logger', 'app-admin')
});

exports.expressHttpLogger = (function () {
  var requestLoggerTransports = [
    new (winstonDaily)({
      name: 'http-request-log',
      filename: path.join(logPath, 'http-requests.log'),
      level: "info",
      tailable: true
    })
  ];
  var requestLoggerConfig = {
    transports: requestLoggerTransports,
    meta: !config.isLocalMode(),
    msg: '{{req.method}} {{req.originalUrl}} {{res.statusCode}}',
    expressFormat: config.isLocalMode(),
    colorStatus: true,
    statusLevels: true,
    level: 'info'
  };
  return expressWinston.logger(requestLoggerConfig);
})();

//default app logger
function loggerDate() {
  return ['[', dateUtil.simpleDate(), ']'].join('');
}

function getLoggerTransports(name, filename) {
  var loggerTransports = [
    new (winston.transports.File)({
      name: name,
      filename: path.join(logPath, filename + '.log'),
      level: "info",
      maxsize: "5242880", //10MB
      maxFiles: 10,
      tailable: true,
      timestamp: loggerDate
    }),
    new (winston.transports.File)({
      name: name + '-error',
      filename: path.join(logPath, filename + '-err.log'),
      level: "error",
      maxsize: "2097152", //5MB
      maxFiles: 10,
      tailable: true,
      timestamp: loggerDate,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ];
  if (config.isLocalMode()) {
    loggerTransports.push(new (winston.transports.Console)({
      colorize: true,
      timestamp: loggerDate,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      level: 'debug'
    }));
  }
  return loggerTransports;
}

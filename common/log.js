var log4js = require("log4js");
var config = require('../config');
var fs = require("fs");
var path = require("path");

var arr = config.log4js.appenders;
arr.forEach(item => {
  var dirPath = "";
  if (!item.filename) {
    dirPath = path.resolve(item.appender.filename);
  } else {
    dirPath = path.resolve(item.filename);
  }
  fs.exists(dirPath, function (exis) {
    if (!exis) fs.mkdir(dirPath);
  });
});

log4js.configure(config.log4js);

exports.logger = function (name) {
  var dateFileLog = log4js.getLogger(name);
  dateFileLog.setLevel(log4js.levels.INFO);
  return dateFileLog;
}

exports.useLog = function (ops) {
  return log4js.connectLogger(log4js.getLogger("npm install sequelize logger"), ops);
}

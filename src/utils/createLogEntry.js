const { Log } = require("../models");

function createLogEntry(logData) {
  return Log.create(logData);
}

module.exports = createLogEntry;

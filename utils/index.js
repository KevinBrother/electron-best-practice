const { app } = require("electron");
const path = require("path");
const log = require("electron-log");

function getAppRootPath() {
  log.info(
    "process.env.NODE_ENV: %s, getAppPath: %s, resourcesPath: %s",
    process.env.NODE_ENV,
    app.getAppPath(),
    process.resourcesPath
  );
  if (process.NODE_ENV == "development") {
    return path.resolve(process.resourcesPath);
  }
  return path.resolve(app.getAppPath());
}

module.exports = {
  getAppRootPath,
};

const mainConfig = require("./webpack.main.config");
const appConfig = require("./webpack.app.config");

const config = [mainConfig, appConfig];

module.exports = config;

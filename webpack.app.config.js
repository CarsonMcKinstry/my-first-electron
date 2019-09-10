const { GAME_HEIGHT, GAME_WIDTH } = require("./constants");
const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const base = require("./webpack.base.config");
const buildPath = path.resolve(__dirname, "./build");

const app = merge(base, {
  mode: "development",
  entry: "./app/index.ts",
  output: {
    filename: "app.js",
    path: buildPath
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateParameters: {
        gameHeight: GAME_HEIGHT,
        gameWidth: GAME_WIDTH
      },
      template: "./app/views/index.ejs",
      meta: {
        viewport: "width=device-width, initial-scale=1"
      }
    }),
    new CopyPlugin([
      {
        from: path.join(__dirname, "./app/assets"),
        to: path.resolve(__dirname, "./build/assets")
      }
    ])
  ],
  target: "electron-renderer",
  devServer: {
    contentBase: buildPath
  }
});

module.exports = app;

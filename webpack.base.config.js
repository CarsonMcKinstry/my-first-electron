const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          }
        ]
      },
      { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: "file" }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./styles.css"
    })
  ]
};

module.exports = config;

const webpack = require("webpack");
const slsw = require("serverless-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const nodeExternals = require("webpack-node-externals");
const path = require("path");

// You can access the options given to serverles with "slsw.lib.options" and
// the serverless instance with "slsw.lib.serverless". This allows you to dynamically
// build the configuration depending on anything available in serverless (e.g.
// the service definition (slsw.lib.serverless.service.xxxxx)

module.exports = {
  entry: "./src/functions/index.ts",
  devtool: 'source-map',
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.(md|jst|def)$/,
        use: [{ loader: "ignore-loader" }]
      },
      {
        test: /\.ts$/,
        enforce: "pre",
        loader: "tslint-loader",
        options: { tsConfigFile: "tsconfig.json" }
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".json", '.tsx', '.ts']
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "../dist"),
    filename: "index.js"
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled",
      reportFilename: "report.html",
      generateStatsFile: false,
      statsFilename: "stats.json",
      logLevel: "info",
      openAnalyzer: false
    })
  ]
};


var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  plugins: [new CopyWebpackPlugin([{ from: "static" }])],
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000
  }
};

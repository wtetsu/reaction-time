var webpack = require('webpack');

module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: "style-loader!css-loader"}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
};

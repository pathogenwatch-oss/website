/* eslint es6: false */

var path = require('path');
var webpack = require('webpack');

var devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/app'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: {
          "stage": 0,
          "plugins": [
            "react-transform"
          ],
          "extra": {
            "react-transform": [{
              "target": "react-transform-webpack-hmr",
              "imports": ["react"],
              "locals": ["module"]
            }, {
              "target": "react-transform-catch-errors",
              "imports": ["react", "redbox-react"]
            }]
          }
        }
      },
      { test: /.json$/, loaders: [ 'json' ] },
      { test: /.css$/, loaders: [ 'style', 'css' ] },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: "file" }
    ]
  }
};

var prodConfig = {
  entry: './src/app',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        loaders: [ 'babel' ],
        include: path.join(__dirname, 'src')
      },
      { test: /.json$/, loaders: [ 'json' ] },
      { test: /.css$/, loaders: [ 'style', 'css' ] },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: "file" }
    ]
  }
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

const path = require('path');
const webpack = require('webpack');

const srcFolder = path.join(__dirname, 'src');

const resolve = {
  alias: {
    '^': srcFolder,
  },
};

const babelSettings = {
  extends: path.join(__dirname, '/.babelrc'),
};

const rules = [
  { test: /.json$/, use: [ 'json' ] },
  { test: /.css$/, use: [ 'style', 'css', 'postcss' ] },
  { test: /\.(png|jpg|jpeg|gif)$/, use: 'file' },
  { test: /\.js$/,
    use: (process.env.NODE_ENV === 'production' ? [] : [ 'react-hot' ]).
      concat([ { loader: 'babel', query: JSON.stringify(babelSettings) } ]),
    include: [
      /(src|universal|cgps-commons)/,
      path.join(__dirname, 'node_modules', 'promise-file-reader'),
    ],
  },
];

const commonPlugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // https://github.com/postcss/postcss-loader/issues/99#issuecomment-255367959
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss() {
        return [
          require('postcss-input-style')(),
          require('postcss-cssnext')({
            feature: {
              autoprefixer: {
                browsers: [ 'last 2 versions', 'Safari 8' ],
              },
            },
          }),
        ];
      },
    },
  }),
];

const devConfig = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src',
  ],
  output: {
    path: __dirname,
    filename: 'wgsa.js',
    publicPath: '/',
  },
  resolve,
  plugins: commonPlugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ]),
  module: {
    rules,
  },
};

const prodConfig = {
  entry: './src',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'wgsa.js',
    publicPath: '/',
  },
  resolve,
  plugins: commonPlugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ]),
  module: {
    rules,
  },
};

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

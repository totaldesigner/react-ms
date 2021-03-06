'use strict';

const path = require('path');
const webpack = require('webpack');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

// plugins
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const logger = require('../../server/utils/logger');

module.exports = require('./webpack.base')({
  entry: {
    main: [
      'eventsource-polyfill',
      'webpack-hot-middleware/client?reload=true',
      path.join(process.cwd(), 'app/index.tsx'),
    ],
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
    ],
  },
  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  loaders: [
    // .ts, .tsx
    {
      test: /\.tsx?$/,
      loader: ['react-hot-loader', 'awesome-typescript-loader'],
    },
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: false,
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),
    new StyleLintPlugin({
      configFile: './.stylelintrc',
      files: ['app/**/*.css'],
      failOnError: false,
    }),
  ],
  devtool: 'inline-source-map',

  performance: {
    hints: false,
  },
});

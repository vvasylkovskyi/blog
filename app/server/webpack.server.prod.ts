// import TerserPlugin from 'terser-webpack-plugin';
import {Configuration} from 'webpack';
import {merge} from 'webpack-merge';
import webpackServerCommonConfig from './webpack.server.common';

const webpackConfig: Configuration = merge(webpackServerCommonConfig, {
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       parallel: true,
  //     }),
  //   ],
  // },
});

export default webpackConfig;

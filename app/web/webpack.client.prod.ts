// @ts-ignore
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
// import TerserPlugin from 'terser-webpack-plugin';
import {merge} from 'webpack-merge';

import webpackClientCommonConfig from './webpack.client.common';

const webpackConfig = merge(webpackClientCommonConfig, {
  mode: 'production',
  devtool: 'inline-source-map',
  module: {},

  // optimization: {
  //   minimizer: [
  //     new TerserPlugin({
  //       parallel: true,
  //     }),
  //     new CssMinimizerPlugin(),
  //   ],
  // },
});

export default webpackConfig;

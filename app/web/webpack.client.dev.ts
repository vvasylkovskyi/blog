import fs from 'fs';
import path from 'path';
// @ts-ignore
import {merge} from 'webpack-merge';
import webpackClientCommonConfig from './webpack.client.common';

const webpackConfig = merge(webpackClientCommonConfig, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    allowedHosts: 'all',
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: process.env.PORT,
    historyApiFallback: true,
    host: '0.0.0.0',
    server: {
      type: process.env.HTTPS_DEV_SERVER ? 'https' : 'http',
      options: process.env.HTTPS_DEV_SERVER
        ? {
            key: fs.readFileSync('../certs/vvasylkovskyi_com.key'),
            cert: fs.readFileSync('../certs/vvasylkovskyi_com.pem'),
          }
        : {},
    },
  },
} as any);

export default webpackConfig;

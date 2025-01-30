import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack, {Configuration} from 'webpack';
// @ts-ignore
import PreloadWebpackPlugin from '@vue/preload-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const webpackClientCommonConfig: Configuration = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Extracts CSS into separate files
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(ttf)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]', // This places the fonts within 'fonts' folder in 'dist'
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Load a custom template (lodash by default)
      template: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './static'),
          to: path.join(
            __dirname,
            `${process.env.BUNDLE_PATH || 'dist'}/static`
          ),
        },
      ],
    }),
    // @ts-ignore
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allAssets',
      fileWhitelist: [new RegExp(`.*.(woff|woff2|eot|ttf)`)],
    }),
    new MiniCssExtractPlugin({
      filename: 'critical.css', // Name of the output CSS file
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_SERVER_URL': JSON.stringify(
        process.env.NODE_SERVER_URL
      ),
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, process.env.BUNDLE_PATH || 'dist'),
    clean: true,
    publicPath: '/',
  },
};

export default webpackClientCommonConfig;

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin =require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CleanWebPackPlugin = require('clean-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve:{
        extensions: ['.js','.png'],
        alias: {
          '@utils': path.resolve(__dirname, 'src/utils'),
          '@templates': path.resolve(__dirname, 'src/templates'),
          '@styles': path.resolve(__dirname, 'src/styles'),
          '@images': path.resolve(__dirname, 'src/assets/images/')
        }
    },
    module: {
        rules: [
          {
            // Test declara que extensión de archivos aplicara el loader
            test: /\.m?js$/,
            // Use es un arreglo u objeto donde dices que loader aplicaras
            use: {
              loader: "babel-loader"
            },
            // Exclude permite omitir archivos o carpetas especificas
            exclude: /node_modules/
          }, 
          {
            test: /\.s?css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
          },
          {
            test: /\.png/,
            type: 'asset/resource'
          },
          {
            test: /\.(woff|woff2)$/,
            use: {
              loader: 'url-loader',
              options:{
                limit: 10000,
                mimetype: "application/font-woff",
                name: "[name].[contenthash].[ext]",
                outputPath: "./assets/fonts",
                publicPath: "../assets/font",
                esModule:false,
              }
            }
          }
        ]
      },
        plugins:[
          new CleanWebPackPlugin({
            cleanOnceBeforeBuildPatterns: [
              path.resolve(__dirname, 'dist/css/*.css'),
              path.resolve(__dirname, 'dist/css/*.js'),
              path.resolve(__dirname, 'dist/css/**'),
            ],
            verbose: true,
          }),
          new Dotenv(),
          new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
          }),
          new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
          }),
          new CopyPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, "src","assets/images"),
                to: "assets/images"
              }
            ]
          })
        ],
        optimization: {
          minimizer: true,
          minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
          ]
        }
}
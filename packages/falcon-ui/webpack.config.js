const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackRTLPlugin = require('@automattic/webpack-rtl-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
	mode: 'development',
	entry: {
		theme: './assets/scss/theme.scss',
		user: './assets/scss/user.scss',
	},
	output: {
		path: path.resolve(__dirname, 'dist/css'),
	},
	plugins: [
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new WebpackRTLPlugin(),
		new CleanWebpackPlugin(),
	],
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(sass|scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							url: false,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
};

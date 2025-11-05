const path = require("path");
const webpack = require("webpack"); // Importa webpack
const dotenv = require("dotenv"); // Importa dotenv
const dev = process.env.NODE_ENV == "development";
const liveServer = require("live-server");
if (dev) {
	liveServer.start({
		root: "./",
		file: "index.html",
		port: 3000,
	});
}

// Cargar variables de entorno desde .env
const env = dotenv.config().parsed || {};

// Mapear variables para DefinePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});

module.exports = {
	watch: dev,
	entry: "./src/index.tsx",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(
				process.env.NODE_ENV || "development"
			),
		}),
		//new webpack.DefinePlugin(envKeys), // Usar las variables mapeadas
	],
};

const path = require("path");
const webpack = require("webpack"); // Importa webpack
const dotenv = require("dotenv"); // Importa dotenv
dotenv.config(); // Carga las variables de entorno desde .env
const CopyPlugin = require("copy-webpack-plugin"); //para copiar el index.html y las imagenes a dist

const dev = process.env.NODE_ENV == "development";

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
			"process.env.REACT_APP_LOCAL_URL": JSON.stringify(
				process.env.REACT_APP_LOCAL_URL
			),
		}),
		new CopyPlugin({
			patterns: [
				{ from: "index.html", to: "" }, // Copia el index.html a dist/
				{ from: "public", to: "public" }, // Copia la carpeta public a dist/
			],
		}),
	],
	devServer: {
		//alternativa de webpack para servir app en desarrollo en vez de live-server
		static: {
			directory: path.join(__dirname, "."), // ubicacion del index.html (raiz)
		},
		historyApiFallback: true,
		compress: true,
		port: 4000,
		hot: true, // Habilita hot reloading
	},
};

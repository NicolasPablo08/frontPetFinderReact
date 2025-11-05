const path = require("path");
const webpack = require("webpack"); // Importa webpack
const dotenv = require("dotenv"); // Importa dotenv
dotenv.config(); // Carga las variables de entorno desde .env

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
		new HtmlWebpackPlugin({
			//para copiar el index html a la carpeta dist
			template: "./index.html", // Ruta a tu archivo HTML en la raíz
			filename: "index.html", // Nombre del archivo de salida en dist
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

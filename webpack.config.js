// codin/cli/webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "mlxd"),
    filename: "index.bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    // Obfuscate the final bundle for extra protection:
    new WebpackObfuscator(
      {
        rotateStringArray: true,
        stringArrayEncoding: ["base64"], // or 'rc4'
        selfDefending: true, // Harder to debug
        debugProtection: true, // Tries to hinder devtools
        controlFlowFlattening: true, // Makes code flow harder to read
      }
      // Exclude specific files or paths if needed:
      // ['excluded_bundle.js']
    ),
  ],
};

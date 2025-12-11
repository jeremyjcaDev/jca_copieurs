const path = require("path");

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  chainWebpack: (config) => {
    if (!isDevelopment) {
      config.plugins.delete("html");
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
    }
    config.resolve.alias.set("@", path.resolve(__dirname, "src"));
  },
  css: {
    extract: false,
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  filenameHashing: false,
  outputDir: "./views/js/vue_front",
  assetsDir: "",
  publicPath: isDevelopment ? "/" : "../modules/jca_copieurs/views/js/vue_front/",
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  }
};

const path = require("path");

module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete("html");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.resolve.alias.set("@", path.resolve(__dirname, "src"));
  },
  css: {
    extract: false,
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  filenameHashing: false,
  outputDir: "../views/js/vue_front", // sous-dossier spécifique pour PrestaShop
  assetsDir: "",
  publicPath: "../modules/jca_copieurs/views/js/vue_front/", // chemin relatif PrestaShop
};

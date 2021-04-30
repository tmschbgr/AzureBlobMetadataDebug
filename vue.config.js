const Webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new Webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|jp/),
    ]
  },
  productionSourceMap: (process.env.NODE_ENV == 'production') ? false : true,
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/sass/_variables.sass"`
      },
      scss: {
        data: `
          @import "@/assets/sass/_variables.scss";
          @import "@/assets/sass/_coloursMap.scss";
          @import "@/assets/sass/_mixins.scss";
          @import "@/assets/sass/styles.scss";
        `
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
};

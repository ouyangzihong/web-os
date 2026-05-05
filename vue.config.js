const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'assets',

  // 修复核心：使用 chainWebpack 替代 configureWebpack
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap(args => {
        if (!args[0].terserOptions) args[0].terserOptions = {};
        if (!args[0].terserOptions.compress) args[0].terserOptions.compress = {};
        args[0].terserOptions.compress.drop_console = true;
        return args;
      });
    }
  }
})
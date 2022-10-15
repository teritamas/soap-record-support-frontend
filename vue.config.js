const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  devServer: {
    proxy: {
      'https://soap-record-support-server-fae3im6i6q-an.a.run.app': {
        target: 'http://localhost:8080',
      },
    },
  },
};

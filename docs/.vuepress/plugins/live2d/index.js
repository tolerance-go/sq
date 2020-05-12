const { resolve } = require('path');

module.exports = (options = {}, context) => ({
  name: 'live2d',
  define() {
    const modelName = options.modelName;
    const mobileShow = options.mobileShow;
    const modelPosition = options.position;

    return {
      MODEL_NAME: modelName || '',
      MOBILE_SHOW: mobileShow || false,
      MODEL_POSITION: modelPosition || 'right',
    };
  },

  enhanceAppFiles: resolve(__dirname, 'enhanceAppFile.js'),
  globalUIComponents: 'Container',
});

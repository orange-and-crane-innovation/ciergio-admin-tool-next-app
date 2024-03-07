module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    'storybook-addon-react-docgen',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-css-modules-preset'
  ],
  webpackFinal: async (config, { configType }) => {
    config.node = {
      ...config.node,
      fs: 'empty',
      assert: 'empty',
      buffer: 'empty',
      console: 'empty',
      constants: 'empty',
      crypto: 'empty',
      domain: 'empty',
      events: 'empty',
      http: 'empty',
      https: 'empty',
      os: 'empty',
      path: 'empty',
      punycode: 'empty',
      process: 'empty',
      querystring: 'empty',
      stream: 'empty',
      string_decoder: 'empty',
      sys: 'empty',
      timers: 'empty',
      tty: 'empty',
      url: 'empty',
      util: 'empty',
      vm: 'empty',
      zlib: 'empty'
    }
    return config
  }
}

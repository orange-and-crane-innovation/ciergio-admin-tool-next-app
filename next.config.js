module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true
      }
    ]
  },
  webpack: (config, _options) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  // experimental: {
  //   esmExternals: false
  // },
  // target: 'serverless',
  // productionBrowserSourceMaps: true
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  }
}

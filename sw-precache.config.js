module.exports = {
  cacheId: 'wgsa',
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [
    /^(?!\/(download|auth|signout)\/)/,
  ],
  staticFileGlobs: [
    'public/*.*',
    'public/images/*.*',
  ],
  dynamicUrlToDependencies: {
    '/index.html': [ 'views/index.ejs' ],
  },
  stripPrefix: 'public',
  runtimeCaching: [
    { urlPattern: /^https?:\/\/.+\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/,
      handler: 'networkFirst',
    },
    { urlPattern: /^https?:\/\/fonts\.googleapis\.com/,
      handler: 'networkFirst',
    },
    { urlPattern: /^https?:\/\/api\.mapbox\.com/,
      handler: 'networkFirst',
    },
  ],
  importScripts: [
    '/sw-fetch-handler.js',
  ],
};

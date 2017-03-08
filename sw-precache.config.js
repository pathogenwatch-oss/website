module.exports = {
  cacheId: 'wgsa',
  navigateFallback: '/index.html',
  staticFileGlobs: [
    'public/*.*',
    'public/images/*.*',
  ],
  dynamicUrlToDependencies: {
    '/index.html': [ 'views/index.ejs' ],
  },
  stripPrefix: 'public',
  runtimeCaching: [
    { urlPattern: /\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/,
      handler: 'cacheFirst',
    },
    { urlPattern: /^https?:\/\/fonts\.googleapis\.com/,
      handler: 'cacheFirst',
    },
  ],
  importScripts: [
    '/sw-fetch-handler.js',
  ],
};

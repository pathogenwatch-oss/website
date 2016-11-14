import React from 'react';

const config = require('./app/config.js');

if (process.env.NODE_ENV !== 'production' && config.whyDidYouUpdate) {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

import './app';

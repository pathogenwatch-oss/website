import React from 'react';

import config from './app/config.js';

if (process.env.NODE_ENV !== 'production' && config.whyDidYouUpdate) {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

import './app';

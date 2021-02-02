import React from 'react';
import { render } from 'react-dom';

import config from './app/config.js';
import App from './app';

if (process.env.NODE_ENV !== 'production' && config.whyDidYouUpdate) {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

render(
  <App />,
  document.getElementById('pathogenwatch')
);

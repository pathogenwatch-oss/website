import React from 'react';
import { render } from 'react-dom';

import App from './app';

// import config from './app/config.js';
// if (process.env.NODE_ENV !== 'production' && config.whyDidYouUpdate) {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

render(
  <App />,
  document.getElementById('pathogenwatch')
);

import './styles.css';

import React from 'react';
import { IndexRoute } from 'react-router';

import Home from './Home.react';

export default (
  <IndexRoute
    component={Home}
    onEnter={() => {
      document.title = 'WGSA | Home';
    }}
  />
);

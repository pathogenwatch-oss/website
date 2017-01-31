import './styles.css';

import React from 'react';
import { Route } from 'react-router';

import Collections from './Collections.react';

export default (
  <Route
    path="collections"
    component={Collections}
    onEnter={() => {
      document.title = 'WGSA | Collections';
    }}
  />
);

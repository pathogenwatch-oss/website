import './styles.css';

import React from 'react';
import { IndexRoute } from 'react-router';
import { combineReducers } from 'redux';

import Home from './Home.react';

import { reducer as filter } from '../home-filter';

export const reducer = combineReducers({ filter });

export default (
  <IndexRoute
    component={Home}
    onEnter={() => {
      document.title = 'WGSA | Home';
    }}
  />
);

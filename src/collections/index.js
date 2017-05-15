import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';

import { Header } from '../header';
import Collections from './Collections.react';

export reducer from './reducer';

const path = '/collections';

export const HeaderRoute = (
  <Route path={path}>
    <Header asideEnabled />
  </Route>
);

export default (
  <Route path={`${path}/:prefilter(all|user|bin)`} component={Collections} />
);

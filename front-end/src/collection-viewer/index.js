import React from 'react';
import { Route } from 'react-router-dom';

import Header from './Header.react';
import CollectionRoute from './route';

const path = '/collection/:token';

export const HeaderRoute = (
  <Route path={path} component={Header} />
);

export default (
  <Route path={path} component={CollectionRoute} />
);

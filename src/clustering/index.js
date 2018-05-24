import React from 'react';
import { Route } from 'react-router-dom';

import Header from '../collection-viewer/Header.react';
import Cluster from './route';

const path = '/genome/:id/cluster';

export const HeaderRoute = (
  <Route path={path} component={Header} />
);

export default (
  <Route path={path} component={Cluster} />
);

import './styles.css';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Progress from './progress';
import Instructions from './instructions';
import Previous from './previous';

export reducer from './reducer';

const path = '/upload';

const Router = () => (
  <Switch>
    <Route path={`${path}/previous`} component={Previous} />
    <Route path={`${path}/:uploadedAt`} component={Progress} />
    <Route component={Instructions} />
  </Switch>
);

export default <Route path={path} component={Router} />;

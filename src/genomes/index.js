import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Header } from '../header';
import Genomes from './component';
import ListView from './list';
import MapView from './map';
import StatsView from './stats';

const path = '/genomes/:prefilter(all|user|bin)';

const GenomeRoute = props => (
  <Genomes {...props}>
    <Switch>
      <Route path={`${path}/map`} component={MapView} />
      <Route path={`${path}/stats`} component={StatsView} />
      <Route component={ListView} />
    </Switch>
  </Genomes>
);

export const HeaderRoute = <Route path={path} component={Header} />;

export default (<Route path={path} component={GenomeRoute} />);

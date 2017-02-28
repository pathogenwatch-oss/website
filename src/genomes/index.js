import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import { connect } from 'react-redux';

import Genomes from './component';
import GridView from './grid';
import MapView from './map';
import StatsView from './stats';

const prefilters = [ 'all', 'user', 'upload', 'bin' ];

export reducer from './reducer';

import DefaultContent from '../header/DefaultContent.react';
import { isAsideDisabled } from './uploads/selectors';

const GenomeHeader = connect(
  state => ({ asideDisabled: isAsideDisabled(state) })
)(
  ({ asideDisabled }) => <DefaultContent asideDisabled={asideDisabled} />
);

export default (
  <Route path="genomes">
    { prefilters.map(prefilter =>
      <Route key={prefilter} path={prefilter}
        component={props => <Genomes {...props} prefilter={prefilter} />}
      >
        <IndexRoute
          component={GridView}
          header={<GenomeHeader />}
        />
        <Route path="map" component={MapView} />
        <Route path="stats" component={StatsView} />
      </Route>
    )}
    <Redirect from="*" to="all" />
    <IndexRedirect to="all" />
  </Route>
);

import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import { connect } from 'react-redux';

import Genomes from './component';
import ListView from './list';
import GridView from './grid';
import MapView from './map';
import StatsView from './stats';

const prefilters = [ 'all', 'user', 'upload', 'bin' ];

export reducer from './reducer';

import DefaultContent from '../header/DefaultContent.react';
import { isAsideEnabled } from './uploads/selectors';

function mapStateToProps(state) {
  return {
    asideEnabled: isAsideEnabled(state),
  };
}

const GenomeHeader = connect(mapStateToProps)(
  ({ asideEnabled }) => <DefaultContent asideEnabled={asideEnabled} />
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
        <Route path="list" component={ListView} header={<GenomeHeader />} />
        <Route path="map"
          component={props => <MapView {...props} stateKey={`GENOMES_${prefilter.toUpperCase()}`} />}
          header={<GenomeHeader />}
        />
        <Route path="stats" component={StatsView} header={<GenomeHeader />} />
      </Route>
    )}
    <Redirect from="*" to="all" />
    <IndexRedirect to="all" />
  </Route>
);

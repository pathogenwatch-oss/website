import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { connect } from 'react-redux';

import App from './App';
import Home from './components/Home.react';
import SpeciesHome from './components/SpeciesHome.react';
import UploadCollection from './components/upload';
import ExploreCollection from './components/explorer';
import NotFound from './components/NotFound.react';

import { updateHeader } from './actions/header';

import Species from './species';

function updateSpecies({ route, dispatch }) {
  Species.current = route.path;
  dispatch(updateHeader({ speciesName: Species.formattedName }));
}

const SpeciesSetter = connect()(React.createClass({

  propTypes: {
    route: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    children: React.PropTypes.object,
  },

  componentWillMount() {
    updateSpecies(this.props);
  },

  componentWillUpdate(nextProps) {
    updateSpecies(nextProps);
  },

  render() {
    return this.props.children;
  },

}));

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      { Species.list.filter(_ => _.active).reduce((routes, { nickname }) =>
        routes.concat([
          <Route key={nickname} path={nickname} component={SpeciesSetter}>
            <IndexRoute component={SpeciesHome} />
            <Route path="upload" component={UploadCollection} />
            <Route path="collection/:id" component={ExploreCollection} />
          </Route>,
        ]), []
      )}
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

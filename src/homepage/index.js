import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Homepage from './Homepage.react';

import { getDeployedOrganismIds } from '../summary/selectors';

import { toggleUserDrawer } from '../header/actions';

function mapStateToProps(state) {
  return {
    deployedOrganisms: new Set(getDeployedOrganismIds(state)),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch(toggleUserDrawer(true)),
  };
}

const component = connect(mapStateToProps, mapDispatchToProps)(Homepage);

export default <Route exact path="/" component={component} />;

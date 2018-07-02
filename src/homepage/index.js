import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Homepage from './Homepage.react';

import { getDeployedOrganismIds } from '../summary/selectors';

function mapStateToProps(state) {
  return {
    deployedOrganisms: new Set(getDeployedOrganismIds(state)),
  };
}

const component = connect(mapStateToProps)(Homepage);

export default <Route exact path="/" component={component} />;

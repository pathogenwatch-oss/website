import './styles.css';

import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Homepage from './Homepage.react';

import { toggleUserDrawer } from '../header/actions';

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch(toggleUserDrawer(true)),
  };
}

const component = connect(null, mapDispatchToProps)(Homepage);

export default <Route exact path="/" component={component} />;

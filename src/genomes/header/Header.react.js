import React from 'react';
import { connect } from 'react-redux';

import { Totals } from '../../filter/summary';
import ViewSwitcher from './ViewSwitcher.react';
import SelectAll from '../selection/SelectAll.react';
import ClearSelection from '../selection/ClearSelection.react';
import SelectionSummary from '../selection/Summary.react';

import { getVisible, getTotal } from './selectors';

const Header = ({ visibleGenomes, totalGenomes }) => (
  <header>
    <button className="mdl-button mdl-button--icon">
      <i className="material-icons">tune</i>
    </button>
    <div className="wgsa-button-group">
      <i className="material-icons" title="View">visibility</i>
      <ViewSwitcher title="List" />
      <ViewSwitcher view="map" title="Map" />
      <ViewSwitcher view="stats" title="Stats" />
    </div>
    <Totals
      visible={visibleGenomes}
      total={totalGenomes}
      itemType="genome"
    />
    <SelectAll />
    <ClearSelection />
    <SelectionSummary />
  </header>
);

function mapStateToProps(state) {
  return {
    visibleGenomes: getVisible(state),
    totalGenomes: getTotal(state),
  };
}

export default connect(mapStateToProps)(Header);

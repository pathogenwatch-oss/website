import React from 'react';
import { connect } from 'react-redux';

import { Totals } from '../../filter/summary';
import ViewSwitcher from './ViewSwitcher.react';
import FilterHeader from '../filter/Header.react';
import SelectionSummary from '../selection';

import { getVisible, getTotal } from './selectors';

const Header = ({ visibleGenomes, totalGenomes }) => (
  <header>
    <FilterHeader />
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

import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary, Totals } from '../../filter/summary';
import ViewSwitcher from './ViewSwitcher.react';
import SelectAll from '../selection/SelectAll.react';
import ClearSelection from '../selection/ClearSelection.react';

import { getTotalGenomes } from '../selectors';
import { getTotal } from './selectors';

const Summary = ({ numVisibleGenomes, totalGenomes }) => {
  if (numVisibleGenomes === 0) {
    return <FilterSummary />;
  }

  return (
    <FilterSummary className="wgsa-hub-summary">
      <div className="wgsa-button-group">
        <i className="material-icons" title="View">visibility</i>
        <ViewSwitcher title="Grid" />
        <ViewSwitcher view="list" title="List" />
        <ViewSwitcher view="map" title="Map" />
        <ViewSwitcher view="stats" title="Stats" />
      </div>
      <Totals
        visible={numVisibleGenomes}
        total={totalGenomes}
        itemType="genome"
      />
      <SelectAll />
      <ClearSelection />
    </FilterSummary>
  );
};

function mapStateToProps(state) {
  return {
    numVisibleGenomes: getTotalGenomes(state),
    totalGenomes: getTotal(state),
  };
}

export default connect(mapStateToProps)(Summary);

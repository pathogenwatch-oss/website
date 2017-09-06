import React from 'react';
import { connect } from 'react-redux';

import { Summary as FilterSummary, Totals } from '../../filter/summary';
import ViewSwitcher from './ViewSwitcher.react';

import { getVisible, getTotal } from './selectors';

const Summary = ({ visibleGenomes, totalGenomes }) => {
  if (visibleGenomes === 0) {
    return <FilterSummary />;
  }

  return (
    <FilterSummary className="wgsa-hub-summary">
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
    </FilterSummary>
  );
};

function mapStateToProps(state) {
  return {
    visibleGenomes: getVisible(state),
    totalGenomes: getTotal(state),
  };
}

export default connect(mapStateToProps)(Summary);

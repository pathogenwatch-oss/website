import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';

import { setSelection } from '../selection/actions';
import { showGenomeDrawer } from '../../genome-drawer';
import { selectByArea } from './actions';
import { fetchGenomeMap } from '../actions';

import { getMarkers, getFilter as getPreviousFilter } from './selectors';
import { getLassoPath } from '../../map/selectors';
import { getFilter } from '../filter/selectors';

const clusterOptions = {
  polygonOptions: {
    color: '#3c7383',
    opacity: 0.8,
    fillOpacity: 0.375,
  },
};

const MapView = React.createClass({

  componentDidMount() {
    const { filter, previousFilter, fetch } = this.props;
    if (filter !== previousFilter) {
      fetch();
    }
  },

  componentWillReceiveProps(previous) {
    if (previous.filter !== this.props.filter) {
      this.props.fetch();
    }
  },

  shouldComponentUpdate(next) {
    return next.markers !== this.props.markers;
  },

  render() {
    const { stateKey, lassoPath, markers, onClick, onLassoPathChange, onMarkerClick } = this.props;
    return (
      <div>
        <WGSAMap
          className="wgsa-hub-map-view"
          cluster
          clusterOptions={clusterOptions}
          lassoPath={lassoPath}
          markers={markers}
          onClick={onClick}
          onLassoPathChange={onLassoPathChange}
          onMarkerClick={onMarkerClick}
          stateKey={stateKey}
        />
      </div>
    );
  },

});

function mapStateToProps(state, props) {
  const filter = getFilter(state);
  const previousFilter = getPreviousFilter(state);
  return {
    filter,
    previousFilter,
    markers: filter === previousFilter ? getMarkers(state) : [],
    lassoPath: getLassoPath(state, props),
  };
}

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onLassoPathChange: path => dispatch(selectByArea(stateKey, path)),
    onClick: () => dispatch(setSelection([])),
    onMarkerClick: ({ id }) => dispatch(showGenomeDrawer(id)),
    fetch: () => dispatch(fetchGenomeMap()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import WGSAMap from '../../map';

import { setSelection } from '../selection/actions';
import { showGenomeDrawer } from '../../genome-drawer';
import { selectByArea, toggleMarkerPopup } from './actions';
import { fetchGenomeMap } from '../actions';

import { getMarkers, getFilter as getPreviousFilter, getPopup } from './selectors';
import { getLassoPath } from '../../map/selectors';
import { getFilter } from '../filter/selectors';

const Marker = React.createClass({

  render() {
    const { marker, style, onClick, popup } = this.props;
    const hasPopup = popup === marker.position.join(',');
    return (
      <div className={classnames(
        'wgsa-marker-cluster',
        { 'has-popup': hasPopup }
      )}
        style={style}
        onClick={event => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          onClick({ marker, event });
        }}
      >
        {marker.genomes.length}
        {hasPopup &&
          <ul className="wgsa-marker-popup mdl-shadow--2dp">
            {marker.genomes.map(({ id, name }) =>
              <li key={id}>{name}</li>
            )}
          </ul>}
      </div>
    );
  },

});

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
    return (
      next.markers !== this.props.markers ||
      next.popup !== this.props.popup
    );
  },

  render() {
    const { stateKey, lassoPath, markers, onClick, onLassoPathChange, onMarkerClick, popup } = this.props;
    return (
      <div className="wgsa-genomes-map">
        <WGSAMap
          className="wgsa-hub-map-view"
          lassoPath={lassoPath}
          markers={markers}
          markerIds={markers}
          markerComponent={Marker}
          markerProps={{ popup }}
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
    markers: getMarkers(state),
    lassoPath: getLassoPath(state, props),
    popup: getPopup(state),
  };
}

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onLassoPathChange: path => dispatch(selectByArea(stateKey, path)),
    onClick: () => dispatch(setSelection([])),
    onMarkerClick: ({ genomes, position }) => {
      if (genomes.length === 1) {
        dispatch(showGenomeDrawer(genomes[0].id, genomes[0].name));
      } else {
        dispatch(toggleMarkerPopup(position));
      }
    },
    fetch: () => dispatch(fetchGenomeMap()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);

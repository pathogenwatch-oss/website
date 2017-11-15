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
    const { marker, style, popup } = this.props;
    return (
      <div className={classnames(
        'wgsa-marker-cluster',
        { 'has-popup': popup === marker }
      )}
        style={style}
        onClick={event => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          if (marker.genomes.length === 1) {
            this.props.showGenomeDrawer(marker.genomes[0]);
          } else {
            this.props.toggleMarkerPopup(marker);
          }
        }}
      >
        {marker.genomes.length}
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
    const { stateKey, lassoPath, markers, onClick, onLassoPathChange, popup } = this.props;
    return (
      <div className="wgsa-genomes-map">
        <WGSAMap
          className="wgsa-hub-map-view"
          lassoPath={lassoPath}
          markers={markers}
          markerIds={markers}
          markerComponent={Marker}
          markerProps={{
            popup,
            showGenomeDrawer: this.props.showGenomeDrawer,
            toggleMarkerPopup: this.props.toggleMarkerPopup,
          }}
          onClick={onClick}
          onLassoPathChange={onLassoPathChange}
          stateKey={stateKey}
        />
        { popup &&
          <ul className="wgsa-genomes-map-popup mdl-shadow--2dp">
            {popup.genomes.map(genome =>
              <li key={genome.id}>
                <button
                  className="mdl-button"
                  onClick={() => this.props.showGenomeDrawer(genome)}
                >
                  {genome.name}
                </button>
              </li>
            )}
          </ul>
        }
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
    showGenomeDrawer: ({ id, name }) => dispatch(showGenomeDrawer(id, name)),
    toggleMarkerPopup: (marker) => dispatch(toggleMarkerPopup(marker)),
    fetch: () => dispatch(fetchGenomeMap()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);

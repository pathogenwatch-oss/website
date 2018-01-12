import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import WGSAMap from '../../map';
import { FormattedName } from '../../organisms';
import AddToSelection from '../selection/AddToSelection.react';
import Spinner from '../../components/Spinner.react';

import { showGenomeDrawer } from '../../genomes/detail';
import { selectByArea, showMarkerPopup, closeMarkerPopup } from './actions';
import { fetchGenomeMap } from '../actions';

import { getMarkers, getFilter as getPreviousFilter, getPopup, getPopupList } from './selectors';
import { getLassoPath } from '../../map/selectors';
import { getFilter } from '../filter/selectors';

const Marker = React.createClass({

  render() {
    const { marker, style, popup } = this.props;
    const hasPopup = popup.position === marker.position;
    return (
      <div className={classnames(
        'wgsa-marker-cluster',
        { 'has-popup': hasPopup }
      )}
        style={style}
        onClick={event => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          if (hasPopup) this.props.closePopup();
          else if (marker.genomes.length === 1) {
            this.props.showGenomeDrawer(marker.genomes[0]);
          } else {
            this.props.showMarkerPopup(marker);
          }
        }}
      >
        {marker.genomes.length}
      </div>
    );
  },

});

const Popup = ({ list, onItemClick, close }) => (
  list.length ?
  <aside className="wgsa-genomes-map-popup mdl-shadow--2dp">
    <header>
      <AddToSelection genomes={list} />
      <h2 className="h4">{list.length} Genome{list.length === 1 ? '' : 's'}</h2>
      <button className="mdl-button mdl-button--icon" onClick={close}>
        <i className="material-icons">close</i>
      </button>
    </header>
    <ul>
      {list.map(genome =>
        <li key={genome.id}>
          <AddToSelection genomes={[ genome ]} />
          <span className="wgsa-checklist-content">
            <button
              title="View Details"
              className="wgsa-link-button"
              onClick={() => onItemClick(genome.id)}
            >
              {genome.name}
            </button>
            <FormattedName
              fullName
              organismId={genome.organismId}
              title={genome.organismName}
            />
          </span>
        </li>
      )}
    </ul>
  </aside> :
  <aside className="wgsa-genomes-map-popup mdl-shadow--2dp is-loading">
    <Spinner />
  </aside>
);

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
      next.popup !== this.props.popup ||
      next.lassoPath !== this.lassoPath
    );
  },

  render() {
    const { stateKey, lassoPath, markers, onLassoPathChange, popup, popupList } = this.props;
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
            closePopup: this.props.closePopup,
            showGenomeDrawer: this.props.showGenomeDrawer,
            showMarkerPopup: this.props.showMarkerPopup,
          }}
          onClick={() => {
            if (lassoPath) {
              this.props.onLassoPathChange(null);
            }
          }}
          onLassoPathChange={onLassoPathChange}
          stateKey={stateKey}
        />
        { popup.position &&
          <Popup
            list={popupList}
            onItemClick={this.props.showGenomeDrawer}
            close={this.props.closePopup}
          /> }
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
    popupList: getPopupList(state),
  };
}

function mapDispatchToProps(dispatch, { stateKey }) {
  return {
    onLassoPathChange: path => dispatch(selectByArea(stateKey, path)),
    showGenomeDrawer: (id) => dispatch(showGenomeDrawer(id)),
    showMarkerPopup: ({ genomes, position }) =>
      dispatch(showMarkerPopup(genomes, position)),
    fetch: () => dispatch(fetchGenomeMap()),
    closePopup: () => dispatch(closeMarkerPopup()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);

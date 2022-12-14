import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import PWMap from '../../map';
import { FormattedName } from '../../organisms';
import AddToSelection from '../selection/AddToSelection.react';
import Spinner from '../../components/Spinner.react';

import { showGenomeReport } from '../../genome-report';
import { selectByArea, showMarkerPopup, closeMarkerPopup } from './actions';
import { fetchGenomeMap } from '../actions';

import {
  getMarkers,
  getFilter as getPreviousFilter,
  getPopup,
  getPopupList,
} from './selectors';
import { getLassoPath } from '../../map/selectors';
import { getFilter } from '../filter/selectors';

const Marker = React.createClass({
  render() {
    const { marker, style, popup } = this.props;
    const hasPopup = popup.position === marker.position;
    return (
      <div
        className={classnames('wgsa-marker-cluster', { 'has-popup': hasPopup })}
        ref={el => {
          this.ref = el;
        }}
        style={style}
        onClick={event => {
          event.stopPropagation();
          event.nativeEvent.stopImmediatePropagation();
          if (hasPopup) this.props.closePopup();
          else {
            this.props.showMarkerPopup(marker);
          }
        }}
      >
        {marker.genomes.length}
      </div>
    );
  },
});

const Popup = ({ list, onItemClick, close }) =>
  (list.length ? (
    <aside className="wgsa-genomes-map-popup mdl-shadow--2dp">
      <header>
        <AddToSelection genomes={list} />
        <h2 className="h4">
          {list.length} Genome{list.length === 1 ? '' : 's'}
        </h2>
        <button className="mdl-button mdl-button--icon" onClick={close}>
          <i className="material-icons">close</i>
        </button>
      </header>
      <ul>
        {list.map(genome => (
          <li key={genome.id}>
            <AddToSelection genomes={[ genome ]} />
            <span className="wgsa-checklist-content">
              <button
                title={`${genome.name} - view report`}
                className="wgsa-link-button"
                onClick={() => onItemClick(genome.id)}
              >
                {genome.name}
              </button>
              <FormattedName
                organismId={genome.organismId}
                title={genome.speciesName}
              >
                <em>{genome.speciesName}</em>
              </FormattedName>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  ) : (
    <aside className="wgsa-genomes-map-popup mdl-shadow--2dp is-loading">
      <Spinner />
    </aside>
  ));

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
    const {
      stateKey,
      lassoPath,
      markers,
      onLassoPathChange,
      popup,
      popupList,
    } = this.props;
    return (
      <div className="wgsa-genomes-map">
        <PWMap
          className="wgsa-hub-map-view"
          lassoPath={lassoPath}
          markers={markers}
          markerIds={markers}
          markerComponent={Marker}
          markerProps={{
            popup,
            closePopup: this.props.closePopup,
            showGenomeReport: this.props.showGenomeReport,
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
        {popup.open && (
          <Popup
            list={popupList}
            onItemClick={this.props.showGenomeReport}
            close={this.props.closePopup}
          />
        )}
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
    showGenomeReport: id => dispatch(showGenomeReport(id)),
    showMarkerPopup: ({ position }) => dispatch(showMarkerPopup([ position ])),
    fetch: () => dispatch(fetchGenomeMap()),
    closePopup: () => dispatch(closeMarkerPopup()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView);

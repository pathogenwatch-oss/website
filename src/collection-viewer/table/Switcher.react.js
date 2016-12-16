import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Switch from '../../components/Switch.react';

import { getVisibleTableName, getVisibleTable } from './selectors';

import { setTable, showTableView } from './actions';

import { tableKeys, views } from './constants';
const { metadata, resistanceProfile } = tableKeys;

const TableSwitcher = ({ displayedTable, displayedView, showMetadataTable, showAMRView }) => (
  <div className="wgsa-table-switcher" onClick={event => event.stopPropagation()}>
    <div className="wgsa-table-content-options wgsa-switch-background mdl-shadow--2dp">
      <button
        className={classnames(
          'wgsa-selectable-column-heading',
          { 'wgsa-selectable-column-heading--active': displayedTable === metadata }
        )}
        onClick={showMetadataTable}
      >
        Metadata
      </button>
      { views[resistanceProfile].map(view =>
        <button key={view}
          className={classnames(
            'wgsa-selectable-column-heading',
            { 'wgsa-selectable-column-heading--active':
              displayedTable === resistanceProfile && view === displayedView }
          )}
          onClick={() => showAMRView(view)}
        >
          {view}
        </button>
      )}
    </div>
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

function mapStateToProps(state) {
  return {
    displayedTable: getVisibleTableName(state),
    displayedView: getVisibleTable(state).view,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showMetadataTable: () => dispatch(setTable(metadata)),
    showAMRView: view => {
      dispatch(setTable(resistanceProfile));
      dispatch(showTableView(view));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableSwitcher);

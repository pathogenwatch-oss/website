import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getVisibleTableName, getVisibleTable } from './selectors';

import { setTable, showTableView } from './actions';

import { tableKeys, views } from './constants';
const { metadata, resistanceProfile } = tableKeys;


const ButtonGroup = ({ children }) => (
  <div className="wgsa-button-group mdl-shadow--2dp">
    {children}
  </div>
);

const Button = ({ active, children, onClick }) => (
  <button className={classnames({ active })} onClick={onClick}>
    {children}
  </button>
);

const TableSwitcher = ({ displayedTable, displayedView, showMetadataTable, showAMRView }) => (
  <div className="wgsa-table-switcher" onClick={event => event.stopPropagation()}>
    <ButtonGroup>
      <Button
        active={displayedTable === metadata}
        onClick={showMetadataTable}
      >
        Metadata
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      { views[resistanceProfile].map(view =>
        <Button
          key={view}
          active={displayedTable === resistanceProfile && view === displayedView}
          onClick={() => showAMRView(view)}
        >
          {view}
        </Button>
      )}
    </ButtonGroup>
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

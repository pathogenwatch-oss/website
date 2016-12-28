import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Switch from '../../components/Switch.react';

import { getVisibleTableName, getVisibleTable } from './selectors';

import { setTable, showTableView } from './actions';

import { tableKeys, views } from './constants';
const { metadata, resistanceProfile } = tableKeys;

const TableSwitcher = ({ displayedTable, displayedView, onSwitchChange, onViewClick }) => (
  <div className="wgsa-table-switcher" onClick={event => event.stopPropagation()}>
    <div className="wgsa-switch-background mdl-shadow--2dp">
      <Switch
        id="table-switcher"
        left={{ title: 'Metadata', icon: 'list' }}
        right={{ title: 'Resistance Profile', icon: 'local_pharmacy' }}
        checked={displayedTable === resistanceProfile}
        onChange={onSwitchChange}
      />
    </div>
    { views[displayedTable] &&
      <div className="wgsa-table-content-options wgsa-switch-background mdl-shadow--2dp">
        { views[displayedTable].map(view =>
          <button key={view}
            className={classnames(
              'wgsa-selectable-column-heading',
              { 'wgsa-selectable-column-heading--active': view === displayedView }
            )}
            onClick={() => onViewClick(view)}
          >
            {view}
          </button>
        )}
      </div>
    }
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
    onSwitchChange:
      checked => dispatch(setTable(checked ? resistanceProfile : metadata)),
    onViewClick: view => dispatch(showTableView(view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableSwitcher);

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Switch from '../../components/Switch.react';

import { getVisibleTableName, getVisibleTable } from './selectors';

import { setTable } from './actions';

import { tableKeys, views } from './constants';
const { metadata, resistanceProfile } = tableKeys;

const style = {
  position: 'absolute',
  zIndex: 3,
  transform: 'translateY(-18px)',
  left: 16,
};

const TableSwitcher = ({ displayedTable, displayedView, dispatch }) => (
  <div style={style} onClick={event => event.stopPropagation()}>
    <div className="wgsa-switch-background mdl-shadow--2dp">
      <Switch
        id="table-switcher"
        left={{ title: 'Metadata', icon: 'list' }}
        right={{ title: 'Resistance Profile', icon: 'local_pharmacy' }}
        checked={displayedTable === resistanceProfile}
        onChange={(checked) =>
          dispatch(setTable(checked ? resistanceProfile : metadata))}
      />
    </div>
    { views[displayedTable] &&
      <div className="wgsa-table-content-options wgsa-switch-background mdl-shadow--2dp">
        { views[displayedTable].map(view =>
          <button
            className={classnames(
              'wgsa-selectable-column-heading',
              { 'wgsa-selectable-column-heading--active': view === displayedView }
            )}
          >
            {view}
          </button>
        )}
      </div>
    }
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

TableSwitcher.propTypes = {
  displayedTable: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    displayedTable: getVisibleTableName(state),
    displayedView: getVisibleTable(state).view,
  };
}

export default connect(mapStateToProps)(TableSwitcher);

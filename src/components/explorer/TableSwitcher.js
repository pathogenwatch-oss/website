import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import Switch from '../Switch.react';

import { setTable } from '^/actions/table';

import { tableKeys } from '^/constants/table';


const { metadata, resistanceProfile } = tableKeys;

const style = {
  position: 'absolute',
  zIndex: 3,
  transform: 'translateY(-18px)',
  left: 16,
};

const TableSwitcher = ({ displayedTable, dispatch }) => (
  <div style={style} className="wgsa-switch-background mdl-shadow--2dp">
    <Switch
      id="table-switcher"
      left={{ title: 'Metadata', icon: 'list' }}
      right={{ title: 'Resistance Profile', icon: 'local_pharmacy' }}
      checked={displayedTable === resistanceProfile}
      onChange={(checked) =>
        dispatch(setTable(checked ? resistanceProfile : metadata))} />
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

TableSwitcher.propTypes = {
  displayedTable: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display }) {
  return {
    displayedTable: display.table,
  };
}

export default connect(mapStateToProps)(TableSwitcher);

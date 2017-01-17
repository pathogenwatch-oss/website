import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getVisibleTableName } from './selectors';

import { setTable } from './actions';

import { tableKeys } from './constants';
const { metadata, antibiotics, snps, genes } = tableKeys;

function mapStateToProps(state) {
  return {
    displayedTable: getVisibleTableName(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showTable: tableKey => dispatch(setTable(tableKey)),
  };
}

const Button = connect(mapStateToProps, mapDispatchToProps)(
  ({ table, label, displayedTable, showTable }) => (
    <button
      className={classnames(
        'wgsa-button-group__item',
        { active: displayedTable === table }
      )}
      onClick={() => showTable(table)}
    >
      {label}
    </button>
  )
);

const ButtonGroup = ({ children }) => (
  <div className="wgsa-button-group mdl-shadow--2dp">
    {children}
  </div>
);

const TableSwitcher = () => (
  <div
    className="wgsa-table-switcher"
    onClick={event => event.stopPropagation()}
  >
    <ButtonGroup>
      <Button table={metadata} label="Metadata" />
    </ButtonGroup>
    <ButtonGroup>
      <i className="material-icons" title="AMR">local_pharmacy</i>
      <Button table={antibiotics} label="Antibiotics" />
      <Button table={snps} label="SNPs" />
      <Button table={genes} label="Genes" />
    </ButtonGroup>
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

export default TableSwitcher;

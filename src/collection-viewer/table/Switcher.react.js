import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getVisibleTableName, hasMetadata, hasTyping } from './selectors';
import { setTable } from './actions';
import { tableKeys } from '../constants';
import Organisms from '../../organisms';

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

const TableSwitcher =
  connect(state => ({
    hasMetadata: hasMetadata(state),
    hasTyping: hasTyping(state),
    hasAMR: !Organisms.uiOptions.noAMR,
  }))(
  props => (
    <div
      className="wgsa-table-switcher"
      onClick={event => event.stopPropagation()}
    >
      <ButtonGroup>
        <i className="material-icons" title="Data">list</i>
        { props.hasMetadata &&
          <Button table={tableKeys.metadata} label="Metadata" /> }
        { props.hasTyping &&
          <Button table={tableKeys.typing} label="Typing" /> }
        <Button table={tableKeys.stats} label="Stats" />
      </ButtonGroup>
      { props.hasAMR &&
        <ButtonGroup>
          <i className="material-icons" title="AMR">local_pharmacy</i>
          <Button table={tableKeys.antibiotics} label="Antibiotics" />
          <Button table={tableKeys.snps} label="SNPs" />
          <Button table={tableKeys.genes} label="Genes" />
        </ButtonGroup> }
    </div>
  )
);

TableSwitcher.displayName = 'TableSwitcher';

export default TableSwitcher;

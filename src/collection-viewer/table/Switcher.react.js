import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Multi from './Multi.react';

import { getVisibleTableName, hasTyping } from './selectors';
import { hasMetadata, hasAMR, hasKleborateAMR } from '../genomes/selectors';

import { setTable } from './actions';

import { tableKeys, tableDisplayNames } from '../constants';

function mapStateToProps(state, { table }) {
  return {
    displayName: tableDisplayNames[table],
    active: getVisibleTableName(state) === table,
  };
}

function mapDispatchToProps(dispatch, { table }) {
  return {
    showTable: () => dispatch(setTable(table)),
  };
}

const Button = connect(mapStateToProps, mapDispatchToProps)(
  ({ displayName, active, showTable }) => (
    <button
      className={classnames('wgsa-button-group__item', { active })}
      onClick={showTable}
    >
      {displayName}
    </button>
  )
);

const ButtonGroup = ({ children }) => (
  <div className="wgsa-button-group mdl-shadow--2dp">
    {children}
  </div>
);

const TableSwitcher = props => (
  <div
    className="wgsa-table-switcher"
    onClick={event => event.stopPropagation()}
  >
    <ButtonGroup>
      <i className="material-icons" title="Data">list</i>
      { props.hasMetadata &&
        <Button table={tableKeys.metadata} /> }
      { props.hasTyping &&
        <Button table={tableKeys.typing} /> }
      <Button table={tableKeys.stats} />
    </ButtonGroup>
    { props.hasAMR &&
      <ButtonGroup>
        <i className="material-icons" title="AMR">local_pharmacy</i>
        <Button table={tableKeys.antibiotics} />
        <Button table={tableKeys.snps} />
        <Button table={tableKeys.genes} />
      </ButtonGroup> }
    { props.hasKleborate &&
      <ButtonGroup>
        <i className="material-icons" title="AMR">local_pharmacy</i>
        <Button table={tableKeys.kleborateAMR} />
      </ButtonGroup> }
    <Multi />
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

function mapSwitcherStateToProps(state) {
  const hasKleborate = hasKleborateAMR(state);
  return {
    hasMetadata: hasMetadata(state),
    hasTyping: hasTyping(state),
    hasKleborate,
    hasAMR: hasAMR(state) && !hasKleborate,
  };
}

export default connect(mapSwitcherStateToProps)(TableSwitcher);

import React from 'react';
import { connect } from 'react-redux';

import ControlsButton from '@cgps/libmicroreact/controls-button';
import MenuButton from '@cgps/libmicroreact/menu-button';
import DropdownMenu from '@cgps/libmicroreact/dropdown-menu';
import Multi from './Multi.react';

import { getVisibleTableName, hasTyping } from './selectors';
import { hasMetadata, hasAMR, hasKleborateAMR } from '../genomes/selectors';

import { setTable } from './actions';

import { tableKeys, tableDisplayNames } from '../constants';
import { hasTimeline } from '../timeline/selectors';

const TimelineButton = connect(
  state => ({
    active: getVisibleTableName(state) === 'timeline',
    timeline: hasTimeline(state),
  }),
  dispatch => ({
    showTimeline: () => dispatch(setTable('timeline')),
  }),
)(
  ({ active, showTimeline, timeline }) => (
    timeline ?
      <ControlsButton active={active} onClick={showTimeline} title="Timeline">
        <i className="material-icons">access_time</i>
      </ControlsButton> :
      null
  )
);

const TableMenu = connect(
  state => {
    const hasKleborate = hasKleborateAMR(state);
    return {
      visibleTable: getVisibleTableName(state),
      metadata: hasMetadata(state),
      typing: hasTyping(state),
      kleborate: hasKleborate,
      amr: hasAMR(state) && !hasKleborate,
    };
  },
  dispatch => ({
    showTable: table => dispatch(setTable(table)),
  })
)(
  ({ visibleTable, showTable, metadata, typing, kleborate, amr }) => (
    <DropdownMenu
      direction="up"
      button={
        <MenuButton
          active={visibleTable !== 'timeline'}
          label={tableDisplayNames[visibleTable] || 'Tables'}
          direction="up"
        />
      }
    >
      {metadata && <button onClick={() => showTable(tableKeys.metadata)}>Metadata</button>}
      {typing && <button onClick={() => showTable(tableKeys.typing)}>Typing</button>}
      <button onClick={() => showTable(tableKeys.stats)}>Stats</button>
      {(amr || kleborate) && <hr />}
      {amr &&
        <>
          <button onClick={() => showTable(tableKeys.antibiotics)}>Antibiotics</button>
          <button onClick={() => showTable(tableKeys.snps)}>SNPs</button>
          <button onClick={() => showTable(tableKeys.genes)}>Genes</button>
        </>
      }
      {kleborate && <button onClick={() => showTable(tableKeys.kleborateAMR)}>Kleborate AMR</button>}
    </DropdownMenu>
  )
);

const TableSwitcher = () => (
  <div
    className="wgsa-table-switcher"
    onClick={event => event.stopPropagation()}
  >
    <TimelineButton />
    <TableMenu />
    <Multi />
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

export default TableSwitcher;

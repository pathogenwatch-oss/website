import React from 'react';
import { connect } from 'react-redux';

import MenuButton from '@cgps/libmicroreact/menu-button';
import DropdownMenu from '@cgps/libmicroreact/dropdown-menu';
import Multi from './Multi.react';

import { hasTyping } from './selectors';
import { hasAMR, hasKleborate, hasKleborateAMR, hasMetadata, hasSarscov2Variants, hasVista } from '../genomes/selectors';
import { hasTimeline } from '../timeline/selectors';

import { setTable } from './actions';
import { showTimeline } from '../timeline/actions';

import { tableDisplayNames, tableKeys } from '../constants';
import { getVisibleSouthView } from '../layout/selectors';

const icons = {
  [tableKeys.metadata]: 'list',
  [tableKeys.typing]: 'list',
  [tableKeys.stats]: 'list',
  [tableKeys.antibiotics]: 'local_pharmacy',
  [tableKeys.snps]: 'local_pharmacy',
  [tableKeys.genes]: 'local_pharmacy',
  [tableKeys.kleborateAMR]: 'local_pharmacy',
  [tableKeys.kleborateAMRGenotypes]: 'local_pharmacy',
  [tableKeys.sarscov2Variants]: 'local_pharmacy',
  [tableKeys.vista]: 'local_pharmacy',
  [tableKeys.timeline]: 'access_time',
};

const TableMenu = connect(
  state => {
    return {
      amr: hasAMR(state) && !hasKleborate(state),
      kleborate: hasKleborate(state),
      kleborateAMR: hasKleborateAMR(state),
      sarscov2Variants: hasSarscov2Variants(state),
      vista: hasVista(state),
      metadata: hasMetadata(state),
      timeline: hasTimeline(state),
      typing: hasTyping(state),
      visibleView: getVisibleSouthView(state),
    };
  },
  dispatch => ({
    showTable: table => dispatch(setTable(table)),
    _showTimeline: visible => dispatch(showTimeline(visible)),
  })
)(
  ({ visibleView, showTable, _showTimeline, metadata, timeline, typing, kleborateAMR, vista, amr, sarscov2Variants }) => (
    <DropdownMenu
      direction="up"
      button={
        <MenuButton
          direction="up"
        >
          <i className="material-icons">{icons[visibleView]}</i>
          {tableDisplayNames[visibleView]}
        </MenuButton>
      }
    >
      {metadata && <button onClick={() => showTable(tableKeys.metadata)}>Metadata</button>}
      {typing && <button onClick={() => showTable(tableKeys.typing)}>Typing</button>}
      <button onClick={() => showTable(tableKeys.stats)}>Stats</button>
      {(amr || kleborateAMR) && <hr />}
      {amr &&
      <>
        <button onClick={() => showTable(tableKeys.antibiotics)}>Antibiotics</button>
        <button onClick={() => showTable(tableKeys.genes)}>Genes</button>
        <button onClick={() => showTable(tableKeys.snps)}>Variants</button>
      </>
      }
      {kleborateAMR && <>
        <button onClick={() => showTable(tableKeys.kleborateAMR)}>{tableDisplayNames[tableKeys.kleborateAMR]}</button>
        <button onClick={() => showTable(tableKeys.kleborateAMRGenotypes)}>{tableDisplayNames[tableKeys.kleborateAMRGenotypes]}</button>
      </>
      }
      {sarscov2Variants && <button onClick={() => showTable(tableKeys.sarscov2Variants)}>Notable Mutations</button>}
      {vista && <hr />}
      {vista && <button onClick={() => showTable(tableKeys.vista)}>Virulence</button>}
      {timeline &&
      <>
        <hr />
        <button onClick={_showTimeline}>Timeline</button>
      </>
      }
    </DropdownMenu>
  )
);

const TableSwitcher = () => (
  <div
    className="wgsa-table-switcher"
    onClick={event => event.stopPropagation()}
  >
    <TableMenu />
    <Multi />
  </div>
);

TableSwitcher.displayName = 'TableSwitcher';

export default TableSwitcher;

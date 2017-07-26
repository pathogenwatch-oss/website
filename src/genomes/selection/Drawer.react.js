import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import Tabs from './Tabs.react';

import {
  getSelectedGenomeList,
  isSelectionLimitReached,
  isDrawerOpen,
} from './selectors';

import { toggleDrawer } from './actions';

import { getSelectionLimit } from './utils';

const SelectionTitle = ({ total, isLimitReached }) => (
  <span
    title={isLimitReached ? `Selection limit of ${getSelectionLimit()} genomes reached.` : null}
  >
    <span className="wgsa-genome-total">{total}</span>&nbsp;
    {` Genome${total === 1 ? '' : 's'} Selected`}&nbsp;
    {isLimitReached ? `(limit is ${getSelectionLimit()}, please refine your selection)` : null}
  </span>
);

const SelectionDrawer = ({ isOpen, visible, total, isLimitReached, toggle }) => (
  <Drawer
    isOpen={isOpen}
    title={<SelectionTitle total={total} isLimitReached={isLimitReached} />}
    visible={visible}
    disabled={isLimitReached}
    onHeaderClick={toggle}
  >
    <Tabs />
  </Drawer>
);

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    visible: selectedGenomes.length > 0,
    total: selectedGenomes.length,
    isLimitReached: isSelectionLimitReached(state),
    isOpen: isDrawerOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: () => dispatch(toggleDrawer()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionDrawer);

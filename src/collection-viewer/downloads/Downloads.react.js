import React from 'react';
import { connect } from 'react-redux';

import Overlay from '../../components/overlay';

import { isMenuOpen, getCounts } from './selectors';

import { setMenuActive } from './actions';

import { showCounts } from '../../utils/genome';

import Tables from './Tables.react';
import Trees from './Trees.react';
import Analysis from './Analysis.react';
import { hasTrees } from '../tree/selectors';

const DownloadsMenu = ({ menuOpen, counts = {}, closeMenu, viewHasTrees }) => (
  <Overlay isVisible={menuOpen} hide={closeMenu}>
    <div className="wgsa-downloads mdl-shadow--4dp">
      <h3 className="mdl-dialog__title">Downloads</h3>
      { Object.keys(counts).length ? showCounts(counts) : null }
      <ul className="wgsa-downloads-menu">
        <Analysis />
        <Tables />
        { viewHasTrees && <Trees /> }
      </ul>
    </div>
  </Overlay>
);

DownloadsMenu.propTypes = {
  menuOpen: React.PropTypes.bool,
  counts: React.PropTypes.object,
  closeMenu: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    viewHasTrees: hasTrees(state),
    menuOpen: isMenuOpen(state),
    counts: getCounts(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(setMenuActive(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadsMenu);

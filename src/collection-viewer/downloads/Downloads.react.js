import React from 'react';
import { connect } from 'react-redux';
import Menu from '@cgps/libmicroreact/dropdown-menu';
import IconButton from '@cgps/libmicroreact/icon-button';

import { isMenuOpen } from './selectors';

import { setMenuActive } from './actions';

import Tables from './Tables.react';
import Trees from './Trees.react';
import Analysis from './Analysis.react';
import { hasTrees } from '../tree/selectors/entities';

const DownloadsMenu = ({ viewHasTrees }) => {
  const [ isOpen, toggleIsOpen ] = React.useState(false);
  return (
    <Menu
      align="right"
      button={
        <IconButton title="Downloads">
          <i className="material-icons" style={{ marginTop: '1px' }}>file_download</i>
        </IconButton>
      }
      className="pw-downloads-menu"
      open={isOpen}
      toggle={() => { toggleIsOpen(!isOpen); }}
      toggleOnClick={false}
    >
      <Analysis />
      <hr />
      <Tables />
      <hr />
      {viewHasTrees && <Trees />}
    </Menu>
  );
};

DownloadsMenu.propTypes = {
  menuOpen: React.PropTypes.bool,
  counts: React.PropTypes.object,
  closeMenu: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    viewHasTrees: hasTrees(state),
    menuOpen: isMenuOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(setMenuActive(false)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadsMenu);

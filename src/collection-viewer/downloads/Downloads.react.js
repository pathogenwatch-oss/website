import React from 'react';
import { connect } from 'react-redux';
import Menu from '@cgps/libmicroreact/dropdown-menu';
import IconButton from '@cgps/libmicroreact/icon-button';

import Analysis from './Analysis.react';
import Network from './Network.react';
import Tables from './Tables.react';
import Trees from './Trees.react';

import { hasTrees } from '../tree/selectors/entities';
import { isClusterView } from '../selectors';

const DownloadsMenu = ({ viewHasTrees, viewHasNetwork }) => {
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
      { viewHasTrees &&
        <>
          <hr />
          <Trees />
        </>
      }
      { viewHasNetwork &&
        <>
          <hr />
          <Network />
        </>
      }
    </Menu>
  );
};

DownloadsMenu.propTypes = {
  viewHasTrees: React.PropTypes.bool,
  viewHasNetwork: React.PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    viewHasTrees: hasTrees(state),
    viewHasNetwork: isClusterView(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);

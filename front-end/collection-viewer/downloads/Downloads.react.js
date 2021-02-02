import React from 'react';
import { connect } from 'react-redux';
import Menu from '@cgps/libmicroreact/dropdown-menu';
import IconButton from '@cgps/libmicroreact/icon-button';

import Analysis from './Analysis.react';
import Network from './Network.react';
import Tables from './Tables.react';
import Timeline from './Timeline.react';
import Trees from './Trees.react';

import { hasTrees } from '../tree/selectors/entities';
import { isClusterView } from '../selectors';
import { hasTimeline } from '../timeline/selectors';

const DownloadsMenu = ({ viewHasTrees, viewHasNetwork, viewHasTimeline }) => {
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
      { (viewHasTrees || viewHasNetwork) && <hr /> }
      { viewHasTrees &&
          <>
            { viewHasTimeline && <Timeline /> }
            <Trees />
          </>
      }
      { viewHasNetwork &&
        <>
          <Network />
          { viewHasTimeline && <Timeline /> }
        </>
      }
    </Menu>
  );
};

DownloadsMenu.propTypes = {
  viewHasTrees: React.PropTypes.bool,
  viewHasNetwork: React.PropTypes.bool,
  viewHasTimeline: React.PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    viewHasTrees: hasTrees(state),
    viewHasNetwork: isClusterView(state),
    viewHasTimeline: hasTimeline(state),
  };
}

export default connect(mapStateToProps)(DownloadsMenu);

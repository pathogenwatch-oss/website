import './styles.css';

import React from 'react';
import SplitPane from 'react-split-pane';
import { connect } from 'react-redux';

import AutoSizer from '@cgps/libmicroreact/auto-sizer';
import History from '@cgps/libmicroreact/history';
import Map from '../map';
import SidePane from '@cgps/libmicroreact/side-pane';
import Summary from '../summary';
import Table from '../table';
import TableSwitcher from '../table/Switcher.react';
import Timeline from '../timeline';
import Tree from '../tree';
import TreeProgress from '../tree/Progress.react';

import ClusterViewNetwork from '~/cluster-viewer/Network.react';

import { getTreeStateKey } from '../tree/selectors';
import { getCollection, getHistory } from '../selectors';
import { getVisibleSouthView } from './selectors';

import { travel } from '@cgps/libmicroreact/history/actions';
import { hasTrees } from '~/collection-viewer/tree/selectors/entities';

const ConnectedHistory = connect(
  (state, { stateKey }) => getHistory(state)[stateKey] || { entries: [] },
  (dispatch, { stateKey }) => ({ onTravel: index => dispatch({ ...travel(index), stateKey }) }),
)(History);

const TreeWithStateKey = connect(
  state => ({ stateKey: getTreeStateKey(state) })
)(Tree);

const SouthSection = connect(
  state => ({ visible: getVisibleSouthView(state) })
)(({ visible, ...props }) => (
  <div style={{ position: 'relative' }}>
    <TableSwitcher />
    {visible === 'timeline' ? <Timeline {...props} /> : <Table {...props} />}
  </div>
));

const NorthSection = ({ isClusterView, treeStateKey, hasTrees, horizontalSize, createdAt }) => {
  const [ verticalSize, setVerticalSize ] = React.useState(null);
  if (isClusterView) {
    return (
      <SplitPane
        split="vertical"
        defaultSize="50%"
        className="wgsa-no-overflow-pane"
        resizerClassName="wgsa-resizer"
        onChange={setVerticalSize}
      >
        <ClusterViewNetwork
          width={verticalSize}
          height={horizontalSize}
        />
        <Map>
          <Summary />
        </Map>
      </SplitPane>
    );
  }

  if (treeStateKey && hasTrees) {
    return (
      <SplitPane
        split="vertical"
        defaultSize="50%"
        className="wgsa-no-overflow-pane"
        resizerClassName="wgsa-resizer"
        onChange={setVerticalSize}
      >
        <AutoSizer component={TreeWithStateKey} />
        <Map>
          <Summary />
        </Map>
      </SplitPane>
    );
  }

  return (
    <Map>
      <Summary />
      {hasTrees && <TreeProgress date={createdAt} />}
    </Map>
  );
};

const defaultHorizontalSize = '62.5%';

const Layout = ({ isClusterView, treeStateKey, createdAt, hasTrees }) => {
  const [ horizontalSize, setHorizontalSize ] = React.useState(null);

  const navStyle = React.useMemo(() => ({
    height: horizontalSize || defaultHorizontalSize,
  }), [ horizontalSize ]);

  const panes = React.useMemo(() => {
    if (isClusterView) return [];
    return [
      {
        title: 'History',
        icon: <i className="material-icons">history</i>,
        component: () => <ConnectedHistory stateKey={treeStateKey} />,
      },
    ];
  }, [ isClusterView, treeStateKey ]);

  return (
    <SidePane panes={panes} navStyle={navStyle}>
      <SplitPane
        split="horizontal"
        defaultSize={defaultHorizontalSize}
        resizerClassName="wgsa-resizer"
        onChange={setHorizontalSize}
      >
        <NorthSection
          createdAt={createdAt}
          isClusterView={isClusterView}
          hasTrees={hasTrees}
          treeStateKey={treeStateKey}
          horizontalSize={horizontalSize}
        />
        <AutoSizer component={SouthSection} />
      </SplitPane>
    </SidePane>
  );
};

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    createdAt: collection.createdAt,
    isClusterView: collection.isClusterView,
    hasTrees: hasTrees(state),
    treeStateKey: getTreeStateKey(state),
  };
}

export default connect(mapStateToProps)(Layout);

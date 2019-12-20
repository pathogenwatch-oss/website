import './styles.css';

import React from 'react';
import SplitPane from 'react-split-pane/src';
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
import { getVisibleTableName } from '../table/selectors';

import { travel } from '@cgps/libmicroreact/history/actions';

const ConnectedHistory = connect(
  (state, { stateKey }) => getHistory(state)[stateKey] || { entries: [] },
  (dispatch, { stateKey }) => ({ onTravel: index => dispatch({ ...travel(index), stateKey }) }),
)(History);

const TreeWithStateKey = connect(
  state => ({ stateKey: getTreeStateKey(state) })
)(Tree);

const SouthSection = connect(
  state => ({ visible: getVisibleTableName(state) })
)(({ visible, ...props }) => (
  <div style={{ position: 'relative' }}>
    <TableSwitcher />
    {visible === 'timeline' ? <Timeline {...props} /> : <Table {...props} />}
  </div>
));

const Layout = React.createClass({
  getInitialState() {
    return {
      horizontalSize: null,
      verticalSize: null,
    };
  },

  renderNorthSection() {
    if (this.props.isClusterView) {
      return (
        <SplitPane
          split="vertical"
          defaultSize="50%"
          className="wgsa-no-overflow-pane"
          resizerClassName="wgsa-resizer"
          onChange={verticalSize => this.setState({ verticalSize })}
        >
          <ClusterViewNetwork
            width={this.state.verticalSize}
            height={this.state.horizontalSize}
          />
          <Map>
            <Summary />
          </Map>
        </SplitPane>
      );
    }

    if (this.props.treeStateKey) {
      return (
        <SplitPane
          split="vertical"
          defaultSize="50%"
          className="wgsa-no-overflow-pane"
          resizerClassName="wgsa-resizer"
          onChange={verticalSize => this.setState({ verticalSize })}
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
        <TreeProgress date={this.props.createdAt} />
      </Map>
    );
  },

  render() {
    const splitPanes = (
      <SplitPane
        split="horizontal"
        defaultSize="62.5%"
        resizerClassName="wgsa-resizer"
        onChange={horizontalSize => this.setState({ horizontalSize })}
      >
        {this.renderNorthSection()}
        <AutoSizer component={SouthSection} />
      </SplitPane>
    );

    if (this.props.isClusterView) return splitPanes;

    const panes = [
      {
        title: 'History',
        icon: <i className="material-icons">history</i>,
        component: () => <ConnectedHistory stateKey={this.props.treeStateKey} />,
      },
    ];

    return (
      <SidePane panes={panes}>
        {splitPanes}
      </SidePane>
    );
  },
});

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    createdAt: collection.createdAt,
    isClusterView: collection.isClusterView,
    treeStateKey: getTreeStateKey(state),
  };
}

export default connect(mapStateToProps)(Layout);

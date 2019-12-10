import './styles.css';

import React from 'react';
import SplitPane from 'react-split-pane/src';
import { connect } from 'react-redux';

import AutoSizer from '@cgps/libmicroreact/auto-sizer';
import SidePane from '@cgps/libmicroreact/side-pane';
import History from '@cgps/libmicroreact/history';
import Tree from '../tree';
import TreeProgress from '../tree/Progress.react';
import Map from '../map';
import Summary from '../summary';
import Table from '../table';

import ClusterViewNetwork from '~/cluster-viewer/Network.react';

import { getTreeStateKey } from '../tree/selectors';
import { getCollection, getHistory } from '../selectors';

import { travel } from '@cgps/libmicroreact/history/actions';

const ConnectedHistory = connect(
  getHistory,
  (dispatch, props) => ({ onTravel: index => dispatch(travel(index, props.treeStateKey)) }),
)(History);

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
          <AutoSizer component={(props) => <Tree {...props} stateKey={this.props.treeStateKey} />} />
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
        defaultSize="68%"
        resizerClassName="wgsa-resizer"
        onChange={horizontalSize => this.setState({ horizontalSize })}
      >
        {this.renderNorthSection()}
        <AutoSizer component={Table} />
      </SplitPane>
    );

    if (this.props.isClusterView) return splitPanes;

    const panes = [
      {
        title: 'History',
        icon: <i className="material-icons">history</i>,
        component: () => <ConnectedHistory treeStateKey={this.props.treeStateKey} />,
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

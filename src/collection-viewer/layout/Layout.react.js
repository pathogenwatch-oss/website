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

import { getVisibleTree } from '../tree/selectors/entities';
import { getCollection, getHistory } from '../selectors';

import { travel } from '@cgps/libmicroreact/history/actions';

const ConnectedHistory = connect(
  getHistory,
  dispatch => ({ onTravel: index => dispatch(travel(index)) }),
)(History);

const panes = [
  {
    title: 'History',
    icon: <i className="material-icons">history</i>,
    component: ConnectedHistory,
  },
];

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

    if (this.props.showTree) {
      return (
        <SplitPane
          split="vertical"
          defaultSize="50%"
          className="wgsa-no-overflow-pane"
          resizerClassName="wgsa-resizer"
          onChange={verticalSize => this.setState({ verticalSize })}
        >
          <AutoSizer component={Tree} />
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
    showTree: getVisibleTree(state) !== null,
  };
}

export default connect(mapStateToProps)(Layout);

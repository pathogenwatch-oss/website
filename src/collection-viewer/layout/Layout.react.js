import './styles.css';

import React from 'react';
import SplitPane from 'react-split-pane/src';
import { AutoSizer } from 'react-virtualized';
import { connect } from 'react-redux';

import Tree from '../tree';
import TreeProgress from '../tree/Progress.react';
import Map from '../map';
import Summary from '../summary';
import Table from '../table';

import ClusterViewNetwork from '../../cluster-viewer/Network.react';

import { getVisibleTree } from '../tree/selectors';
import { getCollection } from '../selectors';

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
          <Tree
            height={this.state.horizontalSize}
            width={this.state.verticalSize}
          />
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
    return (
      <SplitPane
        split="horizontal"
        defaultSize="68%"
        resizerClassName="wgsa-resizer"
        onChange={horizontalSize => this.setState({ horizontalSize })}
      >
        {this.renderNorthSection()}
        <AutoSizer>
          {({ height, width }) => <Table height={height} width={width} />}
        </AutoSizer>
      </SplitPane>
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
